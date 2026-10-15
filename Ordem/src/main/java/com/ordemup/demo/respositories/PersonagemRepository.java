package com.ordemup.demo.respositories;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

import com.ordemup.demo.tela.Personagem;

public interface PersonagemRepository extends CrudRepository<Personagem, Integer>{

	Optional<Personagem> findById(Long id);

	
}
