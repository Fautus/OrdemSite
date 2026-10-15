package com.ordemup.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ControllerInicial {

	@GetMapping("/")
	public String inicial() {
		return "index";
	}
	
	@GetMapping("/item")
    public String item() {
        return "item";
    }
	
	@GetMapping("/loja")
    public String loja() {
        return "loja";
    }
	
	@GetMapping("/personagem")
	public String personagem() {
		return "personagem";
	}
}
