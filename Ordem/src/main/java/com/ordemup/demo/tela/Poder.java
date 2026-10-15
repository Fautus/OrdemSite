package com.ordemup.demo.tela;

import jakarta.annotation.Nullable;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Poder {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	
	@Nullable
	@Column(unique = true)
	private String nomePoderPersonagem;

	//Poderes de classe

	@Nullable
	@Column(unique = true, name = "poder_personagem", columnDefinition = "TEXT")
	private String poderPersonagem;
	
	public Poder() {
		// TODO Auto-generated constructor stub
	}
	
	public Poder(String nomePoderPersonagem, String poderPersonagem) {
		super();
		this.nomePoderPersonagem = nomePoderPersonagem;
		this.poderPersonagem = poderPersonagem;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getNomePoderPersonagem() {
		return nomePoderPersonagem;
	}

	public void setNomePoderPersonagem(String nomePoderPersonagem) {
		this.nomePoderPersonagem = nomePoderPersonagem;
	}

	public String getPoderPersonagem() {
		return poderPersonagem;
	}

	public void setPoderPersonagem(String poderPersonagem) {
		this.poderPersonagem = poderPersonagem;
	}
	
	
}
