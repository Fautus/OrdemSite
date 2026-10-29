package com.ordemup.demo.tela;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/** Registro de criatura de autoria do mestre (não contém conteúdo oficial pré-carregado). */
@Entity
@Table(name = "criatura_mestre")
public class CriaturaMestre {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 120)
    private String nome;
    @Column(length = 120)
    private String elemento;
    private Integer vd;
    private Integer pvMax;
    private Integer defesa;
    @Column(length = 120)
    private String deslocamento;
    private Integer forca;
    private Integer agilidade;
    private Integer intelecto;
    private Integer presenca;
    private Integer vigor;
    @Column(columnDefinition = "TEXT")
    private String resistencias;
    @Column(columnDefinition = "TEXT")
    private String ataques;
    @Column(columnDefinition = "TEXT")
    private String habilidades;
    @Column(columnDefinition = "TEXT")
    private String descricao;
    @Column(columnDefinition = "TEXT")
    private String observacoes;

    public CriaturaMestre() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getElemento() { return elemento; }
    public void setElemento(String elemento) { this.elemento = elemento; }

    public Integer getVd() { return vd; }
    public void setVd(Integer vd) { this.vd = vd; }

    public Integer getPvMax() { return pvMax; }
    public void setPvMax(Integer pvMax) { this.pvMax = pvMax; }

    public Integer getDefesa() { return defesa; }
    public void setDefesa(Integer defesa) { this.defesa = defesa; }

    public String getDeslocamento() { return deslocamento; }
    public void setDeslocamento(String deslocamento) { this.deslocamento = deslocamento; }

    public Integer getForca() { return forca; }
    public void setForca(Integer forca) { this.forca = forca; }

    public Integer getAgilidade() { return agilidade; }
    public void setAgilidade(Integer agilidade) { this.agilidade = agilidade; }

    public Integer getIntelecto() { return intelecto; }
    public void setIntelecto(Integer intelecto) { this.intelecto = intelecto; }

    public Integer getPresenca() { return presenca; }
    public void setPresenca(Integer presenca) { this.presenca = presenca; }

    public Integer getVigor() { return vigor; }
    public void setVigor(Integer vigor) { this.vigor = vigor; }

    public String getResistencias() { return resistencias; }
    public void setResistencias(String resistencias) { this.resistencias = resistencias; }

    public String getAtaques() { return ataques; }
    public void setAtaques(String ataques) { this.ataques = ataques; }

    public String getHabilidades() { return habilidades; }
    public void setHabilidades(String habilidades) { this.habilidades = habilidades; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public String getObservacoes() { return observacoes; }
    public void setObservacoes(String observacoes) { this.observacoes = observacoes; }

}
