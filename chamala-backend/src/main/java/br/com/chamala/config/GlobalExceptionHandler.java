package br.com.chamala.config;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleAllExceptions(Exception ex) {
        // Exceções do Spring que já carregam o próprio status (rota inexistente → 404,
        // método não suportado → 405, corpo inválido → 400, ResponseStatusException etc.)
        // mantêm esse status em vez de virar 500.
        HttpStatusCode status = HttpStatus.INTERNAL_SERVER_ERROR;
        String message = ex.getMessage();
        if (ex instanceof ErrorResponse errorResponse) {
            status = errorResponse.getStatusCode();
            String detail = errorResponse.getBody().getDetail();
            if (detail != null) {
                message = detail;
            }
        }

        if (status.is5xxServerError()) {
            System.err.println("\n🔥 [ERRO INTERNO CAPTURADO]: " + ex.getClass().getName());
            System.err.println("🔥 Mensagem: " + ex.getMessage());
            ex.printStackTrace();
        }

        Map<String, Object> errorMap = new HashMap<>();
        errorMap.put("error", ex.getClass().getSimpleName());
        errorMap.put("message", message != null ? message : "Erro interno no servidor");

        return ResponseEntity.status(status).body(errorMap);
    }
}
