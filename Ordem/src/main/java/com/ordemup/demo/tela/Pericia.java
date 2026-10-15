package com.ordemup.demo.tela;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "pericia")
public class Pericia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String pericia;
    
    @Column(name = "desc_pericia", columnDefinition = "TEXT")
    private String desPericia;

    public Pericia() {
    }

    public Pericia(String pericia, String desPericia) {
        this.pericia = pericia;
        this.desPericia = desPericia;
    }

    public Long getId() {
        return id;
    }

    public String getPericia() {
        return pericia;
    }

    public void setPericia(String pericia) {
        this.pericia = pericia;
    }

    public String getDesPericia() {
        return desPericia;
    }

    public void setDesPericia(String desPericia) {
        this.desPericia = desPericia;
    }
}