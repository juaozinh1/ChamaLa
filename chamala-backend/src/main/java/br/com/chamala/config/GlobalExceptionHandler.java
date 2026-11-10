package br.com.chamala.config;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleAllExceptions(Exception ex) {
        System.err.println("\n🔥 [ERRO INTERNO CAPTURADO]: " + ex.getClass().getName());
        System.err.println("🔥 Mensagem: " + ex.getMessage());
        ex.printStackTrace();

        Map<String, Object> errorMap = new HashMap<>();
        errorMap.put("error", ex.getClass().getSimpleName());
        errorMap.put("message", ex.getMessage() != null ? ex.getMessage() : "Erro interno no servidor");

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorMap);
    }
}