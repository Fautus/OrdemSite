package com.ordemup.demo.controller;

import java.util.Map;

import com.ordemup.demo.respositories.PersonagemRepository;
import com.ordemup.demo.tela.PersonagemRecursos;
import com.ordemup.demo.respositories.PersonagemRecursosRepository;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/personagem/personagens/{personagemId}/recursos")
public class PersonagemRecursosController {

    private final PersonagemRepository personagens;
    private final PersonagemRecursosRepository recursos;

    public PersonagemRecursosController(PersonagemRepository personagens,
                                       PersonagemRecursosRepository recursos) {
        this.personagens = personagens;
        this.recursos = recursos;
    }

    public record ValorRecurso(Integer current, Integer max) {}

    @GetMapping
    public Map<String, Object> consultar(@PathVariable Long personagemId) {
        validarPersonagem(personagemId);
        var armazenado = recursos.findById(personagemId);
        return resposta(armazenado.orElseGet(() -> new PersonagemRecursos(personagemId)),
                        armazenado.isPresent());
    }

    @PatchMapping("/{tipo}")
    @Transactional
    public Map<String, Object> atualizar(@PathVariable Long personagemId,
                                         @PathVariable String tipo,
                                         @RequestBody ValorRecurso valor) {
        validarPersonagem(personagemId);
        if (valor == null || valor.current() == null || valor.max() == null
                || valor.max() < 1 || valor.max() > 9999
                || valor.current() < 0 || valor.current() > valor.max()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                "Informe current entre 0 e max, e max entre 1 e 9999.");
        }
        // Evita criar linhas com valores inconsistentes durante acessos simultâneos.
        recursos.criarSeAusente(personagemId);
        switch (tipo.toLowerCase()) {
            case "pv" -> recursos.atualizarPv(personagemId, valor.current(), valor.max());
            case "pe" -> recursos.atualizarPe(personagemId, valor.current(), valor.max());
            case "san" -> recursos.atualizarSan(personagemId, valor.current(), valor.max());
            default -> throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                "Recurso inválido. Use pv, pe ou san.");
        }
        // Query nativa, seguida de nova consulta (não mantemos uma entidade antiga em memória).
        return resposta(recursos.findById(personagemId).orElseThrow(), true);
    }

    private void validarPersonagem(Long id) {
        if (!personagens.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Personagem não encontrado.");
        }
    }

    private Map<String, Object> resposta(PersonagemRecursos r, boolean inicializado) {
        return Map.of(
            "initialized", inicializado,
            "pv", Map.of("current", r.getPvAtual(), "max", r.getPvMaximo()),
            "pe", Map.of("current", r.getPeAtual(), "max", r.getPeMaximo()),
            "san", Map.of("current", r.getSanAtual(), "max", r.getSanMaximo())
        );
    }
}
