package br.com.chamala.auth;

import br.com.chamala.user.User;
import br.com.chamala.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            System.out.println("\n========== [DEBUG LOGIN] ==========");
            System.out.println("1. Dados recebidos -> Email: [" + request.email() + "] | Senha: [" + request.password() + "]");

            if (request.email() == null || request.password() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "E-mail e senha são obrigatórios."));
            }

            String emailBusca = request.email().trim().toLowerCase();
            var userOpt = userRepository.findByEmail(emailBusca);

            if (userOpt.isEmpty()) {
                System.out.println("❌ 2. Usuário não encontrado para: " + emailBusca);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "E-mail ou senha incorretos."));
            }

            User user = userOpt.get();
            System.out.println("✅ 2. Usuário localizado: " + user.getName() + " | ID: " + user.getId());
            System.out.println("3. Senha gravada no banco: " + user.getPassword());

            boolean match = passwordEncoder.matches(request.password().trim(), user.getPassword());
            System.out.println("4. BCrypt match: " + match);

            if (!match) {
                System.out.println("❌ 5. Senha informada não confere!");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "E-mail ou senha incorretos."));
            }

            String roleStr = (user.getRole() != null) ? String.valueOf(user.getRole()) : "CLIENT";

            System.out.println("✅ 6. Login efetuado com sucesso! Role: " + roleStr);
            System.out.println("===================================\n");

            return ResponseEntity.ok(new LoginResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                roleStr,
                null
            ));

        } catch (Exception e) {
            System.err.println("🔥 [EXCEÇÃO NO AUTH CONTROLLER]: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Erro interno no servidor: " + e.getMessage()));
        }
    }
}