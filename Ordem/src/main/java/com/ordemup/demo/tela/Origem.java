package com.ordemup.demo.tela;

import jakarta.annotation.Nullable;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Origem {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	
	@Nullable
	@Column(unique = true)
	private String origem;

	@Nullable
	private String periciaOrigem;
	
	@Nullable
	@Column(unique = true)
	private String nomePoderOrigem;

	@Nullable
	@Column(unique = true, name = "poder_origem", columnDefinition = "TEXT")
	private String poderOrigem;
	
	public Origem() {
		
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getOrigem() {
		return origem;
	}

	public void setOrigem(String origem) {
		this.origem = origem;
	}

	public String getPericiaOrigem() {
		return periciaOrigem;
	}

	public void setPericiaOrigem(String periciaOrigem) {
		this.periciaOrigem = periciaOrigem;
	}

	public String getPoderOrigem() {
		return poderOrigem;
	}

	public void setPoderOrigem(String poderOrigem) {
		this.poderOrigem = poderOrigem;
	}
	
	public String getNomePoderOrigem() {
		return nomePoderOrigem;
	}

	public void setNomePoderOrigem(String nomePoderOrigem) {
		this.nomePoderOrigem = nomePoderOrigem;
	}

	public Origem(String origem, String periciaOrigem,String nomePoderOrigem, String poderOrigem) {
		super();
		this.origem = origem;
		this.periciaOrigem = periciaOrigem;
		this.nomePoderOrigem = nomePoderOrigem;
		this.poderOrigem = poderOrigem;
	}
}
