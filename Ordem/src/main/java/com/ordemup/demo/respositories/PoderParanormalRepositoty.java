package com.ordemup.demo.respositories;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

import com.ordemup.demo.tela.PoderParanormal;

public interface PoderParanormalRepositoty extends CrudRepository<PoderParanormal, Integer>{

	Optional<PoderParanormal> findById(Long id);
}
