package com.ordemup.demo.tela;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/** Recursos de jogo separados da ficha original, sem alterar Personagem.java. */
@Entity
@Table(name = "personagem_recursos")
public class PersonagemRecursos {
    @Id
    @Column(name = "personagem_id")
    private Long personagemId;

    @Column(name = "pv_atual", nullable = false)
    private int pvAtual = 20;
    @Column(name = "pv_maximo", nullable = false)
    private int pvMaximo = 20;
    @Column(name = "pe_atual", nullable = false)
    private int peAtual = 10;
    @Column(name = "pe_maximo", nullable = false)
    private int peMaximo = 10;
    @Column(name = "san_atual", nullable = false)
    private int sanAtual = 30;
    @Column(name = "san_maximo", nullable = false)
    private int sanMaximo = 30;

    protected PersonagemRecursos() {}

    public PersonagemRecursos(Long personagemId) { this.personagemId = personagemId; }

    public Long getPersonagemId() { return personagemId; }
    public int getPvAtual() { return pvAtual; }
    public int getPvMaximo() { return pvMaximo; }
    public int getPeAtual() { return peAtual; }
    public int getPeMaximo() { return peMaximo; }
    public int getSanAtual() { return sanAtual; }
    public int getSanMaximo() { return sanMaximo; }
}
