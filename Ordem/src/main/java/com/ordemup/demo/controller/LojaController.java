package com.ordemup.demo.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ordemup.demo.tela.GeradorLoja;
import com.ordemup.demo.tela.Item;

@RequestMapping("/api/loja")
@RestController
public class LojaController {

	 private final GeradorLoja geradorLoja;
	 
	 public LojaController(GeradorLoja geradorLoja) {
		this.geradorLoja = geradorLoja;
	}
	 
	 @GetMapping("/pequena")
	    public List<Item> lojaPequena() {
	        return geradorLoja.gerarLojaPequena();
	    }

	    @GetMapping("/media")
	    public List<Item> lojaMedia() {
	        return geradorLoja.gerarLojaMedia();
	    }

	    @GetMapping("/grande")
	    public List<Item> lojaGrande() {
	        return geradorLoja.gerarLojaGrande();
	    }
}
