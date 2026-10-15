package com.ordemup.demo.respositories;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

import com.ordemup.demo.tela.Condicao;

public interface CondicaoRepository extends CrudRepository<Condicao, Integer>{

	Optional<Condicao> findById(Long id);


}
