package com.ordemup.demo.tela;

public class PericiaPersonagemDTO {

    private Long periciaId;
    private int valorPericia;
    

    public PericiaPersonagemDTO() {
    }

    public Long getPericiaId() {
        return periciaId;
    }

    public void setPericiaId(Long periciaId) {
        this.periciaId = periciaId;
    }

    public int getValorPericia() {
        return valorPericia;
    }

    public void setValorPericia(int valorPericia) {
        this.valorPericia = valorPericia;
    }
}