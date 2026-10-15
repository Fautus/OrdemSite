package com.ordemup.demo.respositories;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

import com.ordemup.demo.tela.Trilha;

public interface TrilhaRepository extends CrudRepository<Trilha, Integer> {

	Optional<Trilha> findById(Long id);
}
