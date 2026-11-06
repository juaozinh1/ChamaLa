package br.com.chamala.auth;

public record RegisterRequest(
    String name,
    String email,
    String password,
    String phone,
    String role
) {}