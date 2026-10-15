package com.ordemup.demo.tela;

import jakarta.annotation.Nullable;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Trilha {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	
	//Informa se é combatente/especialista/ocultista
	@Nullable
	private String classePersonagem;
	
	@Nullable
	private String trilhaPersonagem;

	@Nullable
	@Column(unique = true)
	private String nomeHabilidadeTrilhaPersonagem;

	@Nullable
	@Column(unique = true)
	private String descTrilhaPersonagem;
	
	public Trilha() {
		
	}

	public Trilha(String classePersonagem, String trilhaPersonagem, String nomeHabilidadeTrilhaPersonagem,
			String descTrilhaPersonagem) {
		super();
		this.classePersonagem = classePersonagem;
		this.trilhaPersonagem = trilhaPersonagem;
		this.nomeHabilidadeTrilhaPersonagem = nomeHabilidadeTrilhaPersonagem;
		this.descTrilhaPersonagem = descTrilhaPersonagem;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getClassePersonagem() {
		return classePersonagem;
	}

	public void setClassePersonagem(String classePersonagem) {
		this.classePersonagem = classePersonagem;
	}

	public String getTrilhaPersonagem() {
		return trilhaPersonagem;
	}

	public void setTrilhaPersonagem(String trilhaPersonagem) {
		this.trilhaPersonagem = trilhaPersonagem;
	}

	public String getNomeHabilidadeTrilhaPersonagem() {
		return nomeHabilidadeTrilhaPersonagem;
	}

	public void setNomeHabilidadeTrilhaPersonagem(String nomeHabilidadeTrilhaPersonagem) {
		this.nomeHabilidadeTrilhaPersonagem = nomeHabilidadeTrilhaPersonagem;
	}

	public String getDescTrilhaPersonagem() {
		return descTrilhaPersonagem;
	}

	public void setDescTrilhaPersonagem(String descTrilhaPersonagem) {
		this.descTrilhaPersonagem = descTrilhaPersonagem;
	}
	
	
}
