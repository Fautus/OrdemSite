package com.ordemup.demo.respositories;

import org.springframework.data.repository.CrudRepository;

import com.ordemup.demo.tela.PersonagemPericia;

public interface PersonagemPericiaRepository
        extends CrudRepository<PersonagemPericia, Long> {
}