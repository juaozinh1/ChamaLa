package br.com.chamala.user;

import java.util.UUID;

/** Dados da conta exibidos na tela "Minha conta". Nunca inclui a senha. */
public record UserProfileResponse(UUID id, String name, String email, String phone, String role) {

    public static UserProfileResponse from(User user) {
        return new UserProfileResponse(
            user.getId(), user.getName(), user.getEmail(), user.getPhone(), user.getRole());
    }
}
