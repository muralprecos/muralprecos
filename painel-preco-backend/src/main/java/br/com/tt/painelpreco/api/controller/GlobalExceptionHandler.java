package br.com.tt.painelpreco.api.controller;

import br.com.tt.painelpreco.arch.exception.ArchException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ArchException.class)
    public ResponseEntity<Map<String, Object>> handleArchException(ArchException ex) {
        HttpStatus status = HttpStatus.UNPROCESSABLE_ENTITY;
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", Instant.now().toString());
        body.put("status", status.value());
        body.put("error", status.getReasonPhrase());
        body.put("message", extrairMensagemSimplificada(ex.getMessage()));
        return ResponseEntity.status(status).body(body);
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
