package com.ordemup.demo.tela;

import jakarta.annotation.Nullable;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Ritual {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	
	@Nullable
	@Column(unique = true)
	private String nomeRitual;

	@Nullable
	private String execucaoRitual;

	@Nullable
	private String alvoRitual;

	@Nullable
	private String duracaoRitual;

	@Nullable
	private String resistenciaRitual;

	@Nullable
	@Column(unique = true,name = "desc_ritual", columnDefinition = "TEXT")
	private String descRitual;
	
	@Column(name = "elemento_ritual", length = 100)
	private String elementoRitual;
	
	public String getElementoRitual() {
		return elementoRitual;
	}

	public void setElementoRitual(String elementoRitual) {
		this.elementoRitual = elementoRitual;
	}

	public Ritual() {
		// TODO Auto-generated constructor stub
	}
	
	public Ritual(String nomeRitual, String execucaoRitual, String alvoRitual, String duracaoRitual, String resistenciaRitual, String descRitual) {
		super();
		this.nomeRitual = nomeRitual;
		this.execucaoRitual = execucaoRitual;
		this.alvoRitual = alvoRitual;
		this.duracaoRitual = duracaoRitual;
		this.resistenciaRitual = resistenciaRitual;
		this.descRitual = descRitual;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getNomeRitual() {
		return nomeRitual;
	}

	public void setNomeRitual(String nomeRitual) {
		this.nomeRitual = nomeRitual;
	}

	public String getExecucaoRitual() {
		return execucaoRitual;
	}

	public void setExecucaoRitual(String execucaoRitual) {
		this.execucaoRitual = execucaoRitual;
	}

	public String getAlvoRitual() {
		return alvoRitual;
	}

	public void setAlvoRitual(String alvoRitual) {
		this.alvoRitual = alvoRitual;
	}

	public String getDuracaoRitual() {
		return duracaoRitual;
	}

	public void setDuracaoRitual(String duracaoRitual) {
		this.duracaoRitual = duracaoRitual;
	}

	public String getResistenciaRitual() {
		return resistenciaRitual;
	}

	public void setResistenciaRitual(String resistenciaRitual) {
		this.resistenciaRitual = resistenciaRitual;
	}

	public String getDescRitual() {
		return descRitual;
	}

	public void setDescRitual(String descRitual) {
		this.descRitual = descRitual;
	}
	
	
	
}
