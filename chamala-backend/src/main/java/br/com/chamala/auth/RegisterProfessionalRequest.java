package br.com.chamala.auth;

import java.util.List;

public record RegisterProfessionalRequest(
    String name,
    String email,
    String phone,
    String password,
    List<Long> categoryIds,
    Double latitude,
    Double longitude
) {}