package br.com.chamala.auth;

public record LoginRequest(
    String email,
    String password
) {}