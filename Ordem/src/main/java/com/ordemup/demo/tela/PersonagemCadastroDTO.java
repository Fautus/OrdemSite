package com.ordemup.demo.tela;

import java.util.List;

public class PersonagemCadastroDTO {

    private String nome;
    private String nomeJogador;
    private int nivel;
    private int forca;
    private int destreza;
    private int inteligencia;
    private int vontade;
    private int fortitude;
    private List<PericiaPersonagemDTO> pericias;

    public PersonagemCadastroDTO() {
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

    public List<PericiaPersonagemDTO> getPericias() {
        return pericias;
    }

    public void setPericias(List<PericiaPersonagemDTO> pericias) {
        this.pericias = pericias;
    }
}