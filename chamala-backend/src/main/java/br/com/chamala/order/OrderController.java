package br.com.chamala.order;

import br.com.chamala.order.dto.OrderCreateRequest;
import br.com.chamala.order.dto.OrderResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(@RequestBody @Valid OrderCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(orderService.createOrder(request.clientId(), request));
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<OrderResponse>> getNearbyOrders(
            @RequestParam double lat,
            @RequestParam double lon,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(defaultValue = "true") boolean closestFirst) {
        return ResponseEntity.ok(orderService.getNearbyOrders(lat, lon, categoryId, closestFirst));
    }

    @GetMapping("/client")
    public ResponseEntity<List<OrderResponse>> getOrdersByClient(@RequestParam UUID clientId) {
        return ResponseEntity.ok(orderService.getOrdersByClient(clientId));
    }

    @PostMapping("/{orderId}/accept")
    public ResponseEntity<?> acceptOrder(
            @PathVariable UUID orderId,
            @RequestBody Map<String, String> body) {
        String professionalIdStr = body.get("professionalId");
        if (professionalIdStr == null || professionalIdStr.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "O ID do profissional é obrigatório."));
        }

        orderService.acceptOrder(orderId, UUID.fromString(professionalIdStr));
        return ResponseEntity.ok(Map.of("message", "Pedido aceito com sucesso!"));
    }
}