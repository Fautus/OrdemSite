package com.ordemup.demo.controller;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.ordemup.demo.respositories.CriaturaMestreRepository;
import com.ordemup.demo.tela.CriaturaMestre;

@RestController
@RequestMapping("/api/mestre/criaturas")
public class CriaturaMestreController {

    private final CriaturaMestreRepository criaturaMestreRepository;

    public CriaturaMestreController(CriaturaMestreRepository repository) {
        this.criaturaMestreRepository = repository;
    }

    @GetMapping
    public List<CriaturaMestre> listar() {
        return criaturaMestreRepository.findAll(Sort.by(Sort.Direction.ASC, "nome"));
    }

    @GetMapping("/{id}")
    public CriaturaMestre obter(@PathVariable Long id) {
        return criaturaMestreRepository.findById(id).orElseThrow(() ->
            new ResponseStatusException(HttpStatus.NOT_FOUND, "Criatura não encontrada"));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CriaturaMestre criar(@RequestBody CriaturaMestre dados) {
        validar(dados);
        dados.setId(null); // Ignora IDs recebidos ao criar.
        return criaturaMestreRepository.save(dados);
    }

    @PutMapping("/{id}")
    public CriaturaMestre atualizar(@PathVariable Long id, @RequestBody CriaturaMestre dados) {
        CriaturaMestre criatura = obter(id);
        validar(dados);
        criatura.setNome(dados.getNome());
        criatura.setElemento(dados.getElemento());
        criatura.setVd(dados.getVd());
        criatura.setPvMax(dados.getPvMax());
        criatura.setDefesa(dados.getDefesa());
        criatura.setDeslocamento(dados.getDeslocamento());
        criatura.setForca(dados.getForca());
        criatura.setAgilidade(dados.getAgilidade());
        criatura.setIntelecto(dados.getIntelecto());
        criatura.setPresenca(dados.getPresenca());
        criatura.setVigor(dados.getVigor());
        criatura.setResistencias(dados.getResistencias());
        criatura.setAtaques(dados.getAtaques());
        criatura.setHabilidades(dados.getHabilidades());
        criatura.setDescricao(dados.getDescricao());
        criatura.setObservacoes(dados.getObservacoes());
        return criaturaMestreRepository.save(criatura);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable Long id) {
        if (!criaturaMestreRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Criatura não encontrada");
        }
        criaturaMestreRepository.deleteById(id);
    }

    private static void validar(CriaturaMestre criatura) {
        if (criatura.getNome() == null || criatura.getNome().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe o nome da criatura");
        }
        if (criatura.getNome().length() > 120) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nome muito longo");
        }
        if (criatura.getPvMax() != null && criatura.getPvMax() < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "PV máximo não pode ser negativo");
        }
    }
}
