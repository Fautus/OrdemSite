package com.ordemup.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ordemup.demo.respositories.ItemRepository;
import com.ordemup.demo.tela.Item;

// talvez tirar o controller
@RequestMapping("/api/item")
@RestController
public class ItemController {
	
	@Autowired
	private ItemRepository itemRepository;
	
	@PostMapping
	public Item novoItem(@RequestParam String nome, 
						 @RequestParam String categoria,
						 @RequestParam String classificacao,
						 @RequestParam String dano, 
						 @RequestParam String critico, 
						 @RequestParam String alcance ,
						 @RequestParam double espaco, 
						 @RequestParam String descricao) {
		Item item = new Item(nome, categoria, classificacao, dano, critico, alcance, espaco, descricao);
		itemRepository.save(item);
		return item;
	}
	
	@GetMapping
	public Iterable<Item> obterItens() {
		return itemRepository.findAll();
	}
	
	@DeleteMapping(path = "/{id}")
	public void excluirItem(@PathVariable int id) {
		itemRepository.deleteById(id);
	}
	
	@PutMapping("/{id}")
	public Item editarItem(
	        @PathVariable Long id,
	        @RequestParam String nome,
	        @RequestParam String categoria,
	        @RequestParam String classificacao,
	        @RequestParam String dano,
	        @RequestParam String critico,
	        @RequestParam String alcance,
	        @RequestParam double espaco,
	        @RequestParam String descricao) {

	    Item item = itemRepository.findById(id)
	            .orElseThrow(() -> new RuntimeException("Item não encontrado"));

	    item.setNome(nome);
	    item.setCategoria(categoria);
	    item.setClassificacao(classificacao);
	    item.setDano(dano);
	    item.setCritico(critico);
	    item.setAlcance(alcance);
	    item.setEspaco(espaco);
	    item.setDescricao(descricao);

	    return itemRepository.save(item);
	}
	
}
