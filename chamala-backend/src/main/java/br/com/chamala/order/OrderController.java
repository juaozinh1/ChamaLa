package br.com.chamala.order;

import br.com.chamala.order.dto.OrderCreateRequest;
import br.com.chamala.order.dto.OrderResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(
            @RequestParam UUID clientId,
            @RequestBody @Valid OrderCreateRequest request
    ) {
        OrderResponse response = orderService.createOrder(clientId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

   @GetMapping("/nearby")
public ResponseEntity<List<OrderResponse>> getNearbyOrders(
        @RequestParam(name = "lat") double lat,
        @RequestParam(name = "lon") double lon,
        @RequestParam(name = "categoryId", required = false) Long categoryId, // <-- Deve ser Long, não UUID
        @RequestParam(name = "closestFirst", defaultValue = "true") boolean closestFirst
) {
    List<OrderResponse> orders = orderService.getNearbyOrders(lat, lon, categoryId, closestFirst);
    return ResponseEntity.ok(orders);
}
}