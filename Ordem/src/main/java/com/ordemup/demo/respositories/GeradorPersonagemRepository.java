package com.ordemup.demo.respositories;

import org.springframework.data.repository.CrudRepository;

import com.ordemup.demo.tela.geradorPersonagem.GeradorPersonagem;

public interface GeradorPersonagemRepository extends CrudRepository<GeradorPersonagem, Long>{

}
