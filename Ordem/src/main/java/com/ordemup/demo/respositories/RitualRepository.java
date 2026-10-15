package com.ordemup.demo.respositories;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

import com.ordemup.demo.tela.Ritual;

public interface RitualRepository extends CrudRepository<Ritual, Integer>{

	Optional<Ritual> findById(Long id);
}
