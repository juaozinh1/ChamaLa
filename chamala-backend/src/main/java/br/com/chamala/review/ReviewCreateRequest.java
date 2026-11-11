package br.com.chamala.review;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record ReviewCreateRequest(
    @NotNull(message = "O ID do pedido é obrigatório.")
    UUID orderId,

    @NotNull(message = "O ID do cliente é obrigatório.")
    UUID clientId,

    @NotNull(message = "A nota é obrigatória.")
    @Min(value = 1, message = "A nota mínima é 1 estrela.")
    @Max(value = 5, message = "A nota máxima é 5 estrelas.")
    Integer rating,

    String comment
) {}