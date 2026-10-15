package com.ordemup.demo.tela;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;

@Entity
@Table(name = "personagem_pericia")
public class PersonagemPericia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "personagem_id", nullable = false)
    private Personagem personagem;

    @ManyToOne
    @JoinColumn(name = "pericia_id", nullable = false)
    private Pericia pericia;

    private int valorPericia;

    public PersonagemPericia() {
    }

    public PersonagemPericia(
            Personagem personagem,
            Pericia pericia,
            int valorPericia) {
        this.personagem = personagem;
        this.pericia = pericia;
        this.valorPericia = valorPericia;
    }

    public Long getId() {
        return id;
    }

    @JsonIgnore
    public Personagem getPersonagem() {
    	
        return personagem;
    }

    public void setPersonagem(Personagem personagem) {
        this.personagem = personagem;
    }

    public Pericia getPericia() {
        return pericia;
    }

    public void setPericia(Pericia pericia) {
        this.pericia = pericia;
    }

    public int getValorPericia() {
        return valorPericia;
    }

    public void setValorPericia(int valorPericia) {
        this.valorPericia = valorPericia;
    }
}
