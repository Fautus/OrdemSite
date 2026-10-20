package com.ordemup.demo.respositories;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import com.ordemup.demo.tela.PersonagemItem;

public interface PersonagemItemRepository
        extends CrudRepository<PersonagemItem, Long> {

    List<PersonagemItem> findByPersonagem_Id(Long personagemId);
}
