package br.com.chamala.order;

import br.com.chamala.category.Category;
import br.com.chamala.category.CategoryRepository;
import br.com.chamala.order.dto.OrderCreateRequest;
import br.com.chamala.order.dto.OrderResponse;
import br.com.chamala.user.User;
import br.com.chamala.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class OrderService {

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
        User client = userRepository.findById(clientId)
                .orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado com o ID: " + clientId));

        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new IllegalArgumentException("Categoria não encontrada com o ID: " + request.categoryId()));

        Order order = new Order(
                client,
                category,
                request.title(),
                request.description(),
                request.scheduledAt(),
                request.latitude(),
                request.longitude(),
                request.addressReference()
        );

        Order saved = orderRepository.save(order);

        // Se category.getId() for Integer, converte com .longValue() para casar com Long
        Long catId = (category.getId() != null) ? category.getId().longValue() : null;

        return new OrderResponse(
                saved.getId(),
                saved.getTitle(),
                saved.getDescription(),
                saved.getStatus(),
                catId,
                category.getName(),
                client.getId(),
                client.getName(),
                saved.getScheduledAt(),
                saved.getLatitude(),
                saved.getLongitude(),
                saved.getAddressReference(),
                0.0,
                saved.getCreatedAt()
        );
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