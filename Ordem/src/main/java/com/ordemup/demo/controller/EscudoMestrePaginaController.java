package com.ordemup.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class EscudoMestrePaginaController {
    @GetMapping("/escudo-mestre")
    public String abrirEscudoMestre() {
        return "escudo-mestre";
    }
}
