package com.ordemup.demo.respositories;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

import com.ordemup.demo.tela.Origem;

public interface OrigemRepository extends CrudRepository<Origem, Integer>{

	Optional<Origem> findById(Long id);
}
