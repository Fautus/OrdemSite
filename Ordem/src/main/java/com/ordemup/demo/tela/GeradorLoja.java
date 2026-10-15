package com.ordemup.demo.tela;

import java.util.Collections;
import java.util.List;

import org.springframework.stereotype.Service;

import com.ordemup.demo.respositories.ItemRepository;

@Service
public class GeradorLoja {

	
	private final ItemRepository itemRepository;
	
	public GeradorLoja(ItemRepository itemRepository) {
		this.itemRepository = itemRepository;
	}
	
	public List<Item> gerarLojaPequena() {

		List<String> categorias = List.of("0", "I", "II");

	    List<Item> itens = itemRepository.findByCategoriaIn(categorias);

	    Collections.shuffle(itens);

	    return itens.subList(0, 5);
		
	}
	public List<Item> gerarLojaMedia() {
		
		List<String> categorias = List.of("0", "I", "II", "III");
		
		List<Item> itens = itemRepository.findByCategoriaIn(categorias);
		
		Collections.shuffle(itens);
		
		return itens.subList(0, 9);
		
	}
	public List<Item> gerarLojaGrande() {
		
		List<String> categorias = List.of("0", "I", "II", "III", "IV");
		
		List<Item> itens = itemRepository.findByCategoriaIn(categorias);
		
		Collections.shuffle(itens);
		
		return itens.subList(0, 14);
		
	}
	
	
}
