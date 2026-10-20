package com.ordemup.demo.tela;

import java.util.ArrayList;
import java.util.List;

import jakarta.annotation.Nullable;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

@Entity
public class Personagem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Nullable
    private String nome;
    
    @Nullable
    private String nomeJogador;
    
    @Nullable
    private int nivel;
    
  
    private int forca;
    
    
    private int destreza;
    
    
    private int inteligencia;
    
    
    private int vontade;
    
    
    private int fortitude;
    
    @OneToMany(
    	    mappedBy = "personagem",
    	    cascade = CascadeType.ALL,
    	    orphanRemoval = true
    	)
    	private List<PersonagemPericia> pericias = new ArrayList<>();
    
    public void adicionarPericia(PersonagemPericia pericia) {
        pericias.add(pericia);
        pericia.setPersonagem(this);
    }
    
    @ManyToMany
    @JoinTable(
        name = "personagem_trilha",
        joinColumns = @JoinColumn(name = "personagem_id"),
        inverseJoinColumns = @JoinColumn(name = "trilha_id")
    )
    private List<Trilha> trilhas = new ArrayList<>();

    // Poderes de classe do personagem
    @ManyToMany
    @JoinTable(
        name = "personagem_poder",
        joinColumns = @JoinColumn(name = "personagem_id"),
        inverseJoinColumns = @JoinColumn(name = "poder_id")
    )
    private List<Poder> poderesClasse = new ArrayList<>();

    // Poderes paranormais do personagem
    @ManyToMany
    @JoinTable(
        name = "personagem_poder_paranormal",
        joinColumns = @JoinColumn(name = "personagem_id"),
        inverseJoinColumns = @JoinColumn(name = "poder_paranormal_id")
    )
    private List<PoderParanormal> poderesParanormais = new ArrayList<>();
    
    

    public Personagem() {
    }

    

    public Personagem(String nome, String nomeJogador, int nivel, int forca, int destreza, int inteligencia,
			int vontade, int fortitude) {
		super();
		this.nome = nome;
		this.nomeJogador = nomeJogador;
		this.nivel = nivel;
		this.forca = forca;
		this.destreza = destreza;
		this.inteligencia = inteligencia;
		this.vontade = vontade;
		this.fortitude = fortitude;
	}



	public Long getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getNomeJogador() {
        return nomeJogador;
    }

    public void setNomeJogador(String nomeJogador) {
        this.nomeJogador = nomeJogador;
    }

    public int getNivel() {
        return nivel;
    }

    public void setNivel(int nivel) {
        this.nivel = nivel;
    }

	public int getForca() {
		return forca;
	}

	public void setForca(int forca) {
		this.forca = forca;
	}

	public int getDestreza() {
		return destreza;
	}

	public void setDestreza(int destreza) {
		this.destreza = destreza;
	}

	public int getInteligencia() {
		return inteligencia;
	}

	public void setInteligencia(int inteligencia) {
		this.inteligencia = inteligencia;
	}

	public int getVontade() {
		return vontade;
	}

	public void setVontade(int vontade) {
		this.vontade = vontade;
	}

	public int getFortitude() {
		return fortitude;
	}

	public void setFortitude(int fortitude) {
		this.fortitude = fortitude;
	}

	public void setId(Long id) {
		this.id = id;
	}



	public List<PersonagemPericia> getPericias() {
		
		return pericias;
	}



	public void setPericias(List<PersonagemPericia> pericias) {
		this.pericias = pericias;
	}

	public List<Poder> getPoderesClasse() {
	    return poderesClasse;
	}

	public void setPoderesClasse(List<Poder> poderesClasse) {
	    this.poderesClasse = poderesClasse;
	}

	public List<PoderParanormal> getPoderesParanormais() {
	    return poderesParanormais;
	}

	public void setPoderesParanormais(
	        List<PoderParanormal> poderesParanormais) {
	    this.poderesParanormais = poderesParanormais;
	}
	
	public List<Trilha> getTrilhas() {
	    return trilhas;
	}

	public void setTrilhas(List<Trilha> trilhas) {
	    this.trilhas = trilhas;
	}
	
    
}