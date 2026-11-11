package br.com.chamala.order.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record OrderCreateRequest(
    @NotNull(message = "O ID do cliente é obrigatório.")
    UUID clientId,

    @NotBlank(message = "O título é obrigatório.")
    String title,

    @NotBlank(message = "A descrição é obrigatória.")
    String description,

    @NotNull(message = "A categoria é obrigatória.")
    Long categoryId,

    Instant scheduledAt, // <-- Alterado de LocalDateTime para Instant

    @NotNull(message = "A latitude é obrigatória.")
    Double latitude,

    @NotNull(message = "A longitude é obrigatória.")
    Double longitude,

    String addressReference,

    List<String> photos
) {}