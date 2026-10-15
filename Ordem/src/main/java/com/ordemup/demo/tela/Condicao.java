package com.ordemup.demo.tela;

import jakarta.annotation.Nullable;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Condicao {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	
	@Nullable
	@Column(unique = true)
	private String nomeCondicao;

	@Nullable
	@Column(unique = true)
	private String descCondicao;
	
	public Condicao() {
		// TODO Auto-generated constructor stub
	}
	
	
	
	public long getId() {
		return id;
	}



	public void setId(long id) {
		this.id = id;
	}



	public String getNomeCondicao() {
		return nomeCondicao;
	}



	public void setNomeCondicao(String nomeCondicao) {
		this.nomeCondicao = nomeCondicao;
	}



	public String getDescCondicao() {
		return descCondicao;
	}



	public void setDescCondicao(String descCondicao) {
		this.descCondicao = descCondicao;
	}



	public Condicao(String nomeCondicao, String descCondicao) {
		super();
		this.nomeCondicao = nomeCondicao;
		this.descCondicao = descCondicao;
	}
	
}
