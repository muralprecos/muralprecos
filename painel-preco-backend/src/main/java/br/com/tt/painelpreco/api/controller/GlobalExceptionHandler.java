package br.com.tt.painelpreco.api.controller;

import br.com.tt.painelpreco.arch.exception.ArchException;
import br.com.tt.painelpreco.arch.view.http.exception.HttpException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(HttpException.class)
    public ResponseEntity<Map<String, Object>> handleHttpException(HttpException ex) {
        HttpStatus status = mapHttpStatus(ex.getStatusCode());
        return buildErrorResponse(status, extrairMensagemSimplificada(ex.getMessage()));
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<Map<String, Object>> handleAuthenticationException(AuthenticationException ex) {
        return buildErrorResponse(HttpStatus.UNAUTHORIZED, "Token inválido ou expirado");
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, Object>> handleAccessDeniedException(AccessDeniedException ex) {
        return buildErrorResponse(HttpStatus.FORBIDDEN, "Acesso negado");
    }

    @ExceptionHandler(ArchException.class)
    public ResponseEntity<Map<String, Object>> handleArchException(ArchException ex) {
        HttpStatus status = HttpStatus.UNPROCESSABLE_ENTITY;
        return buildErrorResponse(status, extrairMensagemSimplificada(ex.getMessage()));
    }

    private ResponseEntity<Map<String, Object>> buildErrorResponse(HttpStatus status, String message) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", Instant.now().toString());
        body.put("status", status.value());
        body.put("error", status.getReasonPhrase());
        body.put("message", message);
        return ResponseEntity.status(status).body(body);
    }

    private HttpStatus mapHttpStatus(int statusCode) {
        if (statusCode == HttpStatus.UNAUTHORIZED.value()) {
            return HttpStatus.UNAUTHORIZED;
        }
        if (statusCode == HttpStatus.FORBIDDEN.value()) {
            return HttpStatus.FORBIDDEN;
        }
        if (statusCode >= 400 && statusCode < 600) {
            return HttpStatus.valueOf(statusCode);
        }
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }

    private String extrairMensagemSimplificada(String msg) {
        if (msg == null) return "Erro interno";
        String[] separadores = {": Falha ao", ": An error", ": Status code"};
        int corte = msg.length();
        for (String sep : separadores) {
            int idx = msg.indexOf(sep);
            if (idx > 0 && idx < corte) {
                corte = idx;
            }
        }
        return msg.substring(0, corte);
    }
}
