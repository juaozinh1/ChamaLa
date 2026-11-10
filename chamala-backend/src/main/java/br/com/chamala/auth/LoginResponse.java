package br.com.chamala.auth;

import java.util.UUID;

public record LoginResponse(
    UUID id,
    String name,
    String email,
    String role,
    String token
) {}