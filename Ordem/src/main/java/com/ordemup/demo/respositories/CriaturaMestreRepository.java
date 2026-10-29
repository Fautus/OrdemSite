package com.ordemup.demo.respositories;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.repository.CrudRepository;

import com.ordemup.demo.tela.CriaturaMestre;

public interface CriaturaMestreRepository extends CrudRepository<CriaturaMestre, Long> {

	List<CriaturaMestre> findAll(Sort by);
}
