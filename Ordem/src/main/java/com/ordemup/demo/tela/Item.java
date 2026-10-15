package com.ordemup.demo.tela;

import jakarta.annotation.Nullable;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Item {

	public Item() {
		
	}
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	
	@Nullable
	@Column(unique = true)
	private String nome;
	
	@Nullable
	private String categoria;
	
	@Nullable
	private String classificacao;
	
	@Nullable
	private String dano;
	
	@Nullable
	private String critico;
	
	@Nullable
	private String alcance;
	
	@Nullable
	private double espaco;
	
	@Nullable
	@Column(name = "desc_ritual", columnDefinition = "TEXT")
	private String descricao;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	public String getCategoria() {
		return categoria;
	}

	public void setCategoria(String categoria) {
		this.categoria = categoria;
	}
	

	public String getClassificacao() {
		return classificacao;
	}

	public void setClassificacao(String classificacao) {
		this.classificacao = classificacao;
	}

	public String getDano() {
		return dano;
	}

	public void setDano(String dano) {
		this.dano = dano;
	}

	public String getCritico() {
		return critico;
	}

	public void setCritico(String critico) {
		this.critico = critico;
	}

	public String getAlcance() {
		return alcance;
	}

	public void setAlcance(String alcance) {
		this.alcance = alcance;
	}

	public double getEspaco() {
		return espaco;
	}

	public void setEspaco(double espaco) {
		this.espaco = espaco;
	}

	public String getDescricao() {
		return descricao;
	}

	public void setDescricao(String descricao) {
		this.descricao = descricao;
	}

	public Item(String nome, String categoria, String classificacao, String dano, String critico, String alcance, double espaco,
			String descricao) {
		super();
		this.nome = nome;
		this.categoria = categoria;
		this.classificacao = classificacao;
		this.dano = dano;
		this.critico = critico;
		this.alcance = alcance;
		this.espaco = espaco;
		this.descricao = descricao;
	}

//	public Item(String nome2, String categoria2, String classificacao, String dano2, int critico2, String alcance2,
//			int espaco2, String descricao2) {
//		super();
//		this.nome = nome;
//		this.categoria = categoria;
//		this.dano = dano;
//		this.critico = critico;
//		this.alcance = alcance;
//		this.espaco = espaco;
//		this.descricao = descricao;
//	}


	
	
	
}
