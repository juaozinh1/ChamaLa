package br.com.chamala.user;

/**
 * Atualização da conta. Nome e telefone são sempre enviados.
 * Para trocar a senha, envie newPassword junto com currentPassword (a senha atual).
 */
public record UpdateProfileRequest(
    String name,
    String phone,
    String currentPassword,
    String newPassword
) {}
