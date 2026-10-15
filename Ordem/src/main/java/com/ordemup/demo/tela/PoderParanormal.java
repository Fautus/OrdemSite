package com.ordemup.demo.tela;

import jakarta.annotation.Nullable;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class PoderParanormal {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	
	@Nullable
	@Column(unique = true)
	private String nomePoderParanormal;
	
	@Nullable
	private String elementoPoder;

	@Nullable
	@Column(unique = true,name = "desc_poder_paranormal", columnDefinition = "TEXT")
	private String descPoderParanormal;
	
	public PoderParanormal() {
		// TODO Auto-generated constructor stub
	}
	
	public PoderParanormal(String nomePoderParanormal, String elementoPoder, String descPoderParanormal) {
		super();
		this.elementoPoder = elementoPoder;
		this.nomePoderParanormal = nomePoderParanormal;
		this.descPoderParanormal = descPoderParanormal;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getNomePoderParanormal() {
		return nomePoderParanormal;
	}

	public void setNomePoderParanormal(String nomePoderParanormal) {
		this.nomePoderParanormal = nomePoderParanormal;
	}

	public String getDescPoderParanormal() {
		return descPoderParanormal;
	}

	public void setDescPoderParanormal(String descPoderParanormal) {
		this.descPoderParanormal = descPoderParanormal;
	}

	public String getElementoPoder() {
		return elementoPoder;
	}

	public void setElementoPoder(String elementoPoder) {
		this.elementoPoder = elementoPoder;
	}
	
	
	
	
}
