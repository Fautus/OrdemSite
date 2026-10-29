package com.ordemup.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class EscudoJogadorPaginaController {

    @GetMapping("/escudo-jogador")
    public String abrirEscudoJogador() {
        return "escudo-jogador";
    }
}
