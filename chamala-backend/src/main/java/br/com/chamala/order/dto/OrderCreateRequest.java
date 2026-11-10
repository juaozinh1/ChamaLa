package br.com.chamala.order.dto;

import java.time.Instant;

public record OrderCreateRequest(
    Long categoryId,
    String title,
    String description,
    Instant scheduledAt,
    Double latitude,
    Double longitude,
    String addressReference
) {}