package br.com.chamala.order;

import br.com.chamala.category.Category;
import br.com.chamala.category.CategoryRepository;
import br.com.chamala.order.dto.OrderCreateRequest;
import br.com.chamala.order.dto.OrderResponse;
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

    public OrderService(OrderRepository orderRepository,
                        UserRepository userRepository,
                        CategoryRepository categoryRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
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

        Long catId = (category.getId() != null) ? category.getId().longValue() : null;

        Instant scheduledInstant = (saved.getScheduledAt() != null)
                ? saved.getScheduledAt().atZone(BRASILIA_ZONE).toInstant()
                : null;

        Instant createdInstant = (saved.getCreatedAt() != null)
                ? saved.getCreatedAt().atZone(BRASILIA_ZONE).toInstant()
                : Instant.now();

        return new OrderResponse(
                saved.getId(),
                saved.getTitle(),
                saved.getDescription(),
                saved.getStatus(),
                catId,
                category.getName(),
                client.getId(),
                client.getName(),
                scheduledInstant,
                saved.getLatitude(),
                saved.getLongitude(),
                saved.getAddressReference(),
                0.0,
                createdInstant
        );
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

    @Transactional(readOnly = true)
    public List<OrderResponse> getOrdersByClient(UUID clientId) {
        List<Order> orders = orderRepository.findByClientIdOrderByCreatedAtDesc(clientId);

        return orders.stream()
                .map(o -> {
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
                            createdInstant
                    );
                })
                .toList();
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
                        p.getCreatedAt()
                ))
                .toList();
    }
}