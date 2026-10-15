package com.ordemup.demo.respositories;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

import com.ordemup.demo.tela.Poder;

public interface PoderRepository extends CrudRepository<Poder, Integer> {

	Optional<Poder> findById(Long id);
}
