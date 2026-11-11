package br.com.chamala.auth;

import br.com.chamala.user.User;
import br.com.chamala.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
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

            boolean match = passwordEncoder.matches(request.password().trim(), user.getPassword());
            System.out.println("4. BCrypt match: " + match);

            if (!match) {
                System.out.println("❌ 5. Senha informada não confere!");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "E-mail ou senha incorretos."));
            }

            String roleStr = (user.getRole() != null) ? user.getRole() : "CLIENT";

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

    @PostMapping("/register/professional")
    @Transactional
    public ResponseEntity<?> registerProfessional(@RequestBody RegisterProfessionalRequest request) {
        try {
            System.out.println("\n========== [CADASTRO PROFISSIONAL] ==========");
            System.out.println("Dados recebidos -> Nome: " + request.name() + " | Email: " + request.email());

            if (request.name() == null || request.name().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Nome é obrigatório."));
            }

            if (request.email() == null || request.email().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "E-mail é obrigatório."));
            }

            if (request.password() == null || request.password().trim().length() < 6) {
                return ResponseEntity.badRequest().body(Map.of("message", "A senha deve ter no mínimo 6 caracteres."));
            }

            String emailNormalizado = request.email().trim().toLowerCase();

            if (userRepository.findByEmail(emailNormalizado).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of("message", "Já existe um usuário cadastrado com este e-mail."));
            }

            User professional = new User();
            professional.setName(request.name().trim());
            professional.setEmail(emailNormalizado);
            professional.setPhone(request.phone() != null ? request.phone().trim() : null);
            professional.setPassword(passwordEncoder.encode(request.password().trim()));
            professional.setRole("PROFESSIONAL");

            User saved = userRepository.save(professional);

            System.out.println("✅ Profissional cadastrado com sucesso! ID: " + saved.getId());
            System.out.println("=============================================\n");

            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "id", saved.getId(),
                "name", saved.getName(),
                "email", saved.getEmail(),
                "role", saved.getRole(),
                "message", "Cadastro profissional realizado com sucesso!"
            ));

        } catch (Exception e) {
            System.err.println("🔥 [ERRO CADASTRO PROFISSIONAL]: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Erro ao cadastrar profissional: " + e.getMessage()));
        }
    }

    @PostMapping("/register/client")
    @Transactional
    public ResponseEntity<?> registerClient(@RequestBody RegisterProfessionalRequest request) {
        try {
            System.out.println("\n========== [CADASTRO CLIENTE] ==========");
            System.out.println("Dados recebidos -> Nome: " + request.name() + " | Email: " + request.email());

            if (request.name() == null || request.name().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Nome é obrigatório."));
            }

            if (request.email() == null || request.email().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "E-mail é obrigatório."));
            }

            if (request.password() == null || request.password().trim().length() < 6) {
                return ResponseEntity.badRequest().body(Map.of("message", "A senha deve ter no mínimo 6 caracteres."));
            }

            String emailNormalizado = request.email().trim().toLowerCase();

            if (userRepository.findByEmail(emailNormalizado).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of("message", "Já existe um usuário cadastrado com este e-mail."));
            }

            User client = new User();
            client.setName(request.name().trim());
            client.setEmail(emailNormalizado);
            client.setPhone(request.phone() != null ? request.phone().trim() : null);
            client.setPassword(passwordEncoder.encode(request.password().trim()));
            client.setRole("CLIENT");

            User saved = userRepository.save(client);

            System.out.println("✅ Cliente cadastrado com sucesso! ID: " + saved.getId());
            System.out.println("========================================\n");

            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "id", saved.getId(),
                "name", saved.getName(),
                "email", saved.getEmail(),
                "role", saved.getRole(),
                "message", "Conta criada com sucesso!"
            ));

        } catch (Exception e) {
            System.err.println("🔥 [ERRO CADASTRO CLIENTE]: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Erro ao cadastrar usuário: " + e.getMessage()));
        }
    }
}