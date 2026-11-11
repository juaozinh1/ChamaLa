package br.com.chamala.order;

import br.com.chamala.category.Category;
import br.com.chamala.category.CategoryRepository;
import br.com.chamala.order.dto.OrderCreateRequest;
import br.com.chamala.order.dto.OrderResponse;
import br.com.chamala.review.ReviewRepository;
import br.com.chamala.user.User;
import br.com.chamala.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
public class OrderService {

    private static final ZoneId BRASILIA_ZONE = ZoneId.of("America/Sao_Paulo");
    private static final LocalTime INICIO_EXPEDIENTE = LocalTime.of(8, 0);
    private static final LocalTime FIM_EXPEDIENTE = LocalTime.of(18, 0);

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ReviewRepository reviewRepository;

    public OrderService(OrderRepository orderRepository,
                        UserRepository userRepository,
                        CategoryRepository categoryRepository,
                        ReviewRepository reviewRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.reviewRepository = reviewRepository;
    }

    @Transactional
    public OrderResponse createOrder(UUID clientId, OrderCreateRequest request) {
        UUID validClientId = Objects.requireNonNull(clientId, "O ID do cliente não pode ser nulo.");
        Long validCategoryId = Objects.requireNonNull(request.categoryId(), "A categoria não pode ser nula.");

        if (request.scheduledAt() == null) {
            throw new IllegalArgumentException("A data e o horário de agendamento são obrigatórios.");
        }

        validarHorarioComercial(request.scheduledAt());
        LocalDateTime scheduledDateTime = request.scheduledAt().atZone(BRASILIA_ZONE).toLocalDateTime();

        User client = userRepository.findById(validClientId)
                .orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado com o ID: " + validClientId));

        Category category = categoryRepository.findById(validCategoryId)
                .orElseThrow(() -> new IllegalArgumentException("Categoria não encontrada com o ID: " + validCategoryId));

        Order order = new Order(
                client,
                category,
                request.title(),
                request.description(),
                scheduledDateTime,
                request.latitude(),
                request.longitude(),
                request.addressReference()
        );

        Order saved = orderRepository.save(order);
        return toOrderResponse(saved);
    }

    @Transactional
    public void acceptOrder(UUID orderId, UUID professionalId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Pedido não encontrado com o ID: " + orderId));

        if (order.getStatus() != OrderStatus.OPEN) {
            throw new IllegalStateException("Este pedido não está mais disponível para aceite.");
        }

        User professional = userRepository.findById(professionalId)
                .orElseThrow(() -> new IllegalArgumentException("Profissional não encontrado com o ID: " + professionalId));

        order.setProfessional(professional);
        order.setStatus(OrderStatus.ACCEPTED);
        orderRepository.save(order);
    }

    @Transactional
    public void completeOrder(UUID orderId, UUID userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Pedido não encontrado com o ID: " + orderId));

        if (order.getStatus() != OrderStatus.ACCEPTED) {
            throw new IllegalStateException("Apenas pedidos em andamento (ACCEPTED) podem ser finalizados.");
        }

        boolean isClient = order.getClient().getId().equals(userId);
        boolean isProfessional = order.getProfessional() != null && order.getProfessional().getId().equals(userId);

        if (!isClient && !isProfessional) {
            throw new IllegalArgumentException("Você não tem permissão para finalizar este pedido.");
        }

        order.setStatus(OrderStatus.COMPLETED);
        orderRepository.save(order);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getOrdersByClient(UUID clientId) {
        return orderRepository.findByClientIdOrderByCreatedAtDesc(clientId)
                .stream()
                .map(this::toOrderResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getOrdersByProfessional(UUID professionalId) {
        return orderRepository.findByProfessionalIdOrderByCreatedAtDesc(professionalId)
                .stream()
                .map(this::toOrderResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getNearbyOrders(double lat, double lon, Long categoryId, boolean closestFirst) {
        List<OrderDistanceProjection> projections = orderRepository.findNearbyOrders(lat, lon, categoryId, closestFirst);

        return projections.stream()
                .map(p -> new OrderResponse(
                        p.getId(),
                        p.getTitle(),
                        p.getDescription(),
                        OrderStatus.valueOf(p.getStatus()),
                        p.getCategoryId(),
                        p.getCategoryName(),
                        p.getClientId(),
                        p.getClientName(),
                        p.getScheduledAt(),
                        p.getLatitude(),
                        p.getLongitude(),
                        p.getAddressReference(),
                        p.getDistanceKm(),
                        p.getCreatedAt(),
                        null,
                        false
                ))
                .toList();
    }

    private OrderResponse toOrderResponse(Order o) {
        Long catId = (o.getCategory() != null && o.getCategory().getId() != null)
                ? o.getCategory().getId().longValue()
                : null;
        String catName = (o.getCategory() != null) ? o.getCategory().getName() : "Geral";

        Instant scheduledInstant = (o.getScheduledAt() != null)
                ? o.getScheduledAt().atZone(BRASILIA_ZONE).toInstant()
                : null;

        Instant createdInstant = (o.getCreatedAt() != null)
                ? o.getCreatedAt().atZone(BRASILIA_ZONE).toInstant()
                : Instant.now();

        String profName = (o.getProfessional() != null) ? o.getProfessional().getName() : null;
        boolean alreadyReviewed = reviewRepository.existsByOrderId(o.getId());

        return new OrderResponse(
                o.getId(),
                o.getTitle(),
                o.getDescription(),
                o.getStatus(),
                catId,
                catName,
                o.getClient().getId(),
                o.getClient().getName(),
                scheduledInstant,
                o.getLatitude(),
                o.getLongitude(),
                o.getAddressReference(),
                0.0,
                createdInstant,
                profName,
                alreadyReviewed
        );
    }

    private void validarHorarioComercial(Instant scheduledAt) {
        ZonedDateTime dataHoraBrasilia = scheduledAt.atZone(BRASILIA_ZONE);
        ZonedDateTime agoraBrasilia = ZonedDateTime.now(BRASILIA_ZONE);

        if (dataHoraBrasilia.isBefore(agoraBrasilia)) {
            throw new IllegalArgumentException("O agendamento não pode ser para uma data retroativa.");
        }

        DayOfWeek dia = dataHoraBrasilia.getDayOfWeek();
        if (dia == DayOfWeek.SATURDAY || dia == DayOfWeek.SUNDAY) {
            throw new IllegalArgumentException("Agendamentos são restritos a dias úteis (segunda a sexta-feira).");
        }

        LocalTime hora = dataHoraBrasilia.toLocalTime();
        if (hora.isBefore(INICIO_EXPEDIENTE) || hora.isAfter(FIM_EXPEDIENTE)) {
            throw new IllegalArgumentException("Agendamentos permitidos apenas em horário comercial (08:00 às 18:00).");
        }
    }
}