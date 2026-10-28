package com.ordemup.demo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.server.ResponseStatusException;

import com.ordemup.demo.tela.geradorPersonagem.GeradorPersonagem;
import com.ordemup.demo.tela.geradorPersonagem.GeradorPersonagemService;

@Controller
public class GeradorPersonagemController {

    private final GeradorPersonagemService service;

    public GeradorPersonagemController(GeradorPersonagemService service) {
        this.service = service;
    }

    // GET /gerador-personagem -> tela HTML
    @GetMapping("/gerador-personagem")
    public String pagina() {
        return "gerador-personagem";
    }

    // GET /api/gerador-personagem/gerar?idadeMin=18&idadeMax=60 -> JSON
    @ResponseBody
    @GetMapping("/api/gerador-personagem/gerar")
    public GeradorPersonagem gerar(
            @RequestParam(defaultValue = "18") int idadeMin,
            @RequestParam(defaultValue = "60") int idadeMax) {

        if (idadeMin < 1 || idadeMax > 110 || idadeMin > idadeMax) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Faixa etária inválida (1 a 110 anos, mínimo <= máximo)."
            );
        }

        return service.gerarPersonagem(idadeMin, idadeMax);
    }
}
