package com.ordemup.demo.respositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

import com.ordemup.demo.tela.Item;

public interface ItemRepository extends CrudRepository<Item, Integer>{

	Optional<Item> findById(Long id);


	
	List<Item> findByCategoriaIn(List<String> categoria);
	
}
