package br.com.chamala.user;

import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

/**
 * Conta do usuário logado ("Minha conta").
 *
 * <p>Enquanto o JWT não estiver ligado, a conta é identificada pelo id salvo no app após o
 * login. Trocar a senha exige a senha atual.
 */
@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private static final int MIN_PASSWORD = 6;

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/{id}")
    public UserProfileResponse get(@PathVariable UUID id) {
        return UserProfileResponse.from(find(id));
    }

    @PutMapping("/{id}")
    @Transactional
    public UserProfileResponse update(@PathVariable UUID id, @RequestBody UpdateProfileRequest req) {
        User user = find(id);

        String name = req.name() == null ? "" : req.name().trim();
        if (name.isEmpty()) {
            throw badRequest("Informe seu nome completo.");
        }
        if (name.length() > 255) {
            throw badRequest("O nome pode ter no máximo 255 caracteres.");
        }

        String phone = req.phone() == null ? "" : req.phone().replaceAll("\\D", "");
        if (phone.length() < 10 || phone.length() > 11) {
            throw badRequest("Informe um telefone com DDD válido.");
        }

        String newPassword = req.newPassword();
        if (newPassword != null && !newPassword.isEmpty()) {
            if (req.currentPassword() == null
                || !passwordEncoder.matches(req.currentPassword(), user.getPassword())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "A senha atual está incorreta.");
            }
            if (newPassword.length() < MIN_PASSWORD) {
                throw badRequest("A nova senha deve ter no mínimo 6 caracteres.");
            }
            user.setPassword(passwordEncoder.encode(newPassword));
        }

        user.setName(name);
        user.setPhone(phone);
        return UserProfileResponse.from(userRepository.save(user));
    }

    private User find(UUID id) {
        return userRepository
            .findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Conta não encontrada."));
    }

    private static ResponseStatusException badRequest(String message) {
        return new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
    }
}
