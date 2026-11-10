package br.com.chamala.order.dto;

import br.com.chamala.order.OrderStatus;
import java.time.Instant;
import java.util.UUID;

public record OrderResponse(
    UUID id,
    String title,
    String description,
    OrderStatus status,
    Long categoryId,
    String categoryName,
    UUID clientId,
    String clientName,
    Instant scheduledAt,
    Double latitude,
    Double longitude,
    String addressReference,
    Double distanceKm,
    Instant createdAt
) {}