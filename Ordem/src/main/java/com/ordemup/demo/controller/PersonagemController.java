package com.ordemup.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.ordemup.demo.respositories.CondicaoRepository;
import com.ordemup.demo.respositories.OrigemRepository;
import com.ordemup.demo.respositories.PericiasRepository;
import com.ordemup.demo.respositories.PersonagemRepository;
import com.ordemup.demo.respositories.PoderParanormalRepositoty;
import com.ordemup.demo.respositories.PoderRepository;
import com.ordemup.demo.respositories.RitualRepository;
import com.ordemup.demo.respositories.TrilhaRepository;
import com.ordemup.demo.tela.Condicao;
import com.ordemup.demo.tela.Origem;
import com.ordemup.demo.tela.Pericia;
import com.ordemup.demo.tela.PericiaPersonagemDTO;
import com.ordemup.demo.tela.Personagem;
import com.ordemup.demo.tela.PersonagemCadastroDTO;
import com.ordemup.demo.tela.PersonagemPericia;
import com.ordemup.demo.tela.Poder;
import com.ordemup.demo.tela.PoderParanormal;
import com.ordemup.demo.tela.Ritual;
import com.ordemup.demo.tela.Trilha;

import jakarta.transaction.Transactional;

@RequestMapping("/api/personagem")
@RestController
public class PersonagemController {

	//Condicação
	
    @Autowired
    private CondicaoRepository condicaoRepository;

    @PostMapping("/condicao")
    public Condicao novaCondicao(
            @RequestParam String nomeCondicao,
            @RequestParam String descCondicao) {

        Condicao condicao = new Condicao(nomeCondicao, descCondicao);

        condicaoRepository.save(condicao);

        return condicao;
    }

    @GetMapping("/condicao")
    public Iterable<Condicao> obterCondicao() {

        return condicaoRepository.findAll();
    }

    @DeleteMapping(path = "/condicao/{id}")
    public void excluirCondicao(@PathVariable int id) {

        condicaoRepository.deleteById(id);
    }

    @PutMapping("/condicao/{id}")
    public Condicao editarCondicao(
            @PathVariable Long id,
            @RequestParam String nomeCondicao,
            @RequestParam String descCondicao) {

        Condicao condicao = condicaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Condição não encontrada"));

        condicao.setNomeCondicao(nomeCondicao);
        condicao.setDescCondicao(descCondicao);

        return condicaoRepository.save(condicao);
    }
    
    //Fim condição
    
    //Origem
    
    @Autowired
    private OrigemRepository origemRepository;
    
    @PostMapping("/origem")
    public Origem novaOrigem(
    		@RequestParam String origem, 
    		@RequestParam String periciaOrigem,
    		@RequestParam String nomePoderOrigem,
    		@RequestParam String poderOrigem) {
    	Origem origem1 = new Origem(origem, periciaOrigem, nomePoderOrigem, poderOrigem);
    	origemRepository.save(origem1);
    	return origem1;
    }
    
    @GetMapping("/origem")
    public Iterable<Origem> obterOrigem() {

        return origemRepository.findAll();
    }
    
    @DeleteMapping(path = "/origem/{id}")
    public void excluirOrigem(@PathVariable int id) {
    	origemRepository.deleteById(id);
    }
    
    @PutMapping("origem/{id}")
    public Origem editarOrigem(
    		@PathVariable Long id, 
    		@RequestParam String origem, 
    		@RequestParam String periciaOrigem,
    		@RequestParam String nomePoderOrigem,
    		@RequestParam String poderOrigem) {
    	Origem origem1 = origemRepository.findById(id)
    			.orElseThrow(() -> new RuntimeException("Origem não encontrada"));
    	
    	origem1.setNomePoderOrigem(nomePoderOrigem);
    	origem1.setOrigem(origem);
    	origem1.setPericiaOrigem(periciaOrigem);
    	origem1.setPoderOrigem(poderOrigem);
    	
    	return origemRepository.save(origem1);
    }
    
    //Fim Origem
    
    //Poder
    
    @Autowired
    private PoderRepository poderRepository;
    
    @PostMapping("/poder")
    public Poder novoPoder(
    		@RequestParam String nomePoderPersonagem, 
    		@RequestParam String poderPersonagem) {
    	Poder poder = new Poder(nomePoderPersonagem, poderPersonagem);
    	
    	poderRepository.save(poder);
    	return poder;
    }
    
    @GetMapping("/poder")
    public Iterable<Poder> obterPoder() {
    	
    	return poderRepository.findAll();
    }
    
    @DeleteMapping(path = "/poder/{id}")
    public void excluirPoder(@PathVariable int id) {
    	
    	poderRepository.deleteById(id);
    }
    
    @PutMapping("/poder/{id}")
    public Poder editarPoder(
    		@PathVariable Long id,
    		@RequestParam String nomePoderPersonagem,
    		@RequestParam String poderPersonagem) {
    	
    	Poder poder = poderRepository.findById(id)
    			.orElseThrow(() -> new RuntimeException("Poder não encontrado"));
    	
    	poder.setNomePoderPersonagem(nomePoderPersonagem);
    	poder.setPoderPersonagem(poderPersonagem);
    	
    	return poderRepository.save(poder);
    }
    
    //Fim poder
    
    //Poder Paranormal
    
    @Autowired
    private PoderParanormalRepositoty poderParanormalRepositoty;
    
    @PostMapping("/poderParanormal")
    public PoderParanormal novoPoderParanormal(
    		@RequestParam String nomePoderParanormal,
    		@RequestParam String elementoPoder,
    		@RequestParam String descPoderParanormal) {
    		
    	
    	PoderParanormal poderParanormal = new PoderParanormal(nomePoderParanormal, elementoPoder, descPoderParanormal);
    	
    	poderParanormalRepositoty.save(poderParanormal);
    	
    	return poderParanormal;
    }
    
    @GetMapping("/poderParanormal")
    public Iterable<PoderParanormal> obterPoderParanormal() {
    	
    	return poderParanormalRepositoty.findAll();
    }
    
    @DeleteMapping(path = "/poderParanormal/{id}")
    public void excluirPoderParanormal(@PathVariable int id) {
    	
    	poderParanormalRepositoty.deleteById(id);
    }
    
    @PutMapping("/poderParanormal/{id}")
    public PoderParanormal editarPoderParanormal(
    		@PathVariable Long id,
    		@RequestParam String nomePoderParanormal,
    		@RequestParam String elementoPoder,
    		@RequestParam String descPoderParanormal) {
    	
    	PoderParanormal poderParanormal = poderParanormalRepositoty.findById(id)
    			.orElseThrow(() -> new RuntimeException("Poder paranormal não encontrado"));
    	
    	poderParanormal.setNomePoderParanormal(nomePoderParanormal);
    	poderParanormal.setDescPoderParanormal(descPoderParanormal);
    	poderParanormal.setElementoPoder(elementoPoder);
    	
    	return poderParanormalRepositoty.save(poderParanormal);
    }
    
    //Fim poder Paranormal
    
    //Ritual
    
    @Autowired
    private RitualRepository ritualRepository;
    
    @PostMapping("/ritual")
    public Ritual novoRitual(
    		@RequestParam String nomeRitual,
    		@RequestParam String execucaoRitual,
    		@RequestParam String alvoRitual,
    		@RequestParam String duracaoRitual,
    		@RequestParam String resistenciaRitual,
    		@RequestParam String descRitual) {
    	
    	Ritual ritual = new Ritual(nomeRitual, execucaoRitual, alvoRitual, duracaoRitual, resistenciaRitual, descRitual);
    	
    	ritualRepository.save(ritual);
    	
    	return ritual;
    }
    
    @GetMapping("/ritual")
    public Iterable<Ritual> obterRitual() {
    	
    	return ritualRepository.findAll();
    }
    
    @DeleteMapping(path = "/ritual/{id}")
    public void excluirRitual(@PathVariable int id) {
    	
    	ritualRepository.deleteById(id);
    }
    
    @PutMapping("/ritual/{id}")
    public Ritual editarRitual(
    		@PathVariable Long id, 
    		@RequestParam String nomeRitual,
    		@RequestParam String execucaoRitual,
    		@RequestParam String alvoRitual,
    		@RequestParam String duracaoRitual,
    		@RequestParam String resistenciaRitual,
    		@RequestParam String descRitual) {
    	
    	Ritual ritual = ritualRepository.findById(id).orElseThrow(() -> new RuntimeException("Ritual não encontrado"));
    	
    	ritual.setNomeRitual(nomeRitual);
    	ritual.setExecucaoRitual(execucaoRitual);
    	ritual.setAlvoRitual(alvoRitual);
    	ritual.setDuracaoRitual(duracaoRitual);
    	ritual.setResistenciaRitual(resistenciaRitual);
    	ritual.setDescRitual(descRitual);
    	
    	return ritualRepository.save(ritual);
    }
    
    //Fim ritual
    
    //Trilha
    
    @Autowired
    private TrilhaRepository trilhaRepository;
    
    @PostMapping("/trilha")
    public Trilha novaTrilha(
    		@RequestParam String classePersonagem,
    		@RequestParam String trilhaPersonagem,
    		@RequestParam String nomeHabilidadeTrilhaPersonagem,
    		@RequestParam String descTrilhaPersonagem) {
    	
    	Trilha trilha = new Trilha(classePersonagem, trilhaPersonagem, nomeHabilidadeTrilhaPersonagem, descTrilhaPersonagem);
    	
    	trilhaRepository.save(trilha);
    	
    	return trilha;
    }
    
    @GetMapping("/trilha")
    public Iterable<Trilha> obterTrilha() {
    	
    	return trilhaRepository.findAll();
    }
    
    @DeleteMapping(path = "/trilha/{id}")
    public void excluirTrilha(@PathVariable int id) {
    	
    	trilhaRepository.deleteById(id);
    }
    
    @PutMapping("/trilha/{id}")
    public Trilha editarTrilha(
    		@PathVariable Long id,
    		@RequestParam String classePersonagem,
    		@RequestParam String trilhaPersonagem,
    		@RequestParam String nomeHabilidadeTrilhaPersonagem,
    		@RequestParam String descTrilhaPersonagem) {
    	
    	Trilha trilha = trilhaRepository.findById(id).orElseThrow(() -> new RuntimeException("Trilha não encontrada"));
    	
    	trilha.setClassePersonagem(classePersonagem);
    	trilha.setTrilhaPersonagem(trilhaPersonagem);
    	trilha.setNomeHabilidadeTrilhaPersonagem(nomeHabilidadeTrilhaPersonagem);
    	trilha.setDescTrilhaPersonagem(descTrilhaPersonagem);
    	
    	return trilhaRepository.save(trilha);
    }
    
    //Fim trilha
    
    //Personagem
    
    @Autowired
    private PersonagemRepository personagemRepository;
    
    @PostMapping
    public Personagem novaPersonagem(
    		@RequestBody PersonagemCadastroDTO dados) {
    	
    	Personagem personagem = new Personagem(
    			dados.getNome(),
    			dados.getNomeJogador(),
    			dados.getNivel(),
    			dados.getForca(),
    			dados.getDestreza(),
    			dados.getInteligencia(),
    			dados.getVontade(),
    			dados.getFortitude()
    			
    			);
    	
    	if (dados.getPericias() != null) {
            for (PericiaPersonagemDTO dadosPericia : dados.getPericias()) {

                Pericia pericia = periciaRepository
                        .findById(dadosPericia.getPericiaId())
                        .orElseThrow(() ->
                                new RuntimeException("Perícia não encontrada"));

                PersonagemPericia personagemPericia =
                        new PersonagemPericia(
                                personagem,
                                pericia,
                                dadosPericia.getValorPericia()
                        );

                personagem.adicionarPericia(personagemPericia);
            }
        }

        return personagemRepository.save(personagem);
    }
    
    @GetMapping("/personagens")
    public Iterable<Personagem> obterPersonagem() {
    	
    	return personagemRepository.findAll();
    }
    
    @DeleteMapping("/personagens/{id}")
    public void excluirPersonagem(@PathVariable Integer id) {
        if (!personagemRepository.existsById(id)) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Personagem não encontrado"
            );
        }

        personagemRepository.deleteById(id);
    }
    
    @PutMapping("/personagens/{id}")
    @Transactional
    public Personagem editarPersonagem(
            @PathVariable Long id,
            @RequestBody PersonagemCadastroDTO dados) {

        Personagem personagem = personagemRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Personagem não encontrado"
            ));

        personagem.setNome(dados.getNome());
        personagem.setNomeJogador(dados.getNomeJogador());
        personagem.setNivel(dados.getNivel());
        personagem.setForca(dados.getForca());
        personagem.setDestreza(dados.getDestreza());
        personagem.setInteligencia(dados.getInteligencia());
        personagem.setVontade(dados.getVontade());
        personagem.setFortitude(dados.getFortitude());

        // Atualiza as perícias do personagem
        if (dados.getPericias() != null) {
            personagem.getPericias().clear();

            for (PericiaPersonagemDTO dadosPericia : dados.getPericias()) {
                Pericia pericia = periciaRepository
                    .findById(dadosPericia.getPericiaId())
                    .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "Perícia não encontrada"
                    ));

                PersonagemPericia relacao = new PersonagemPericia(
                    personagem,
                    pericia,
                    dadosPericia.getValorPericia()
                );

                personagem.adicionarPericia(relacao);
            }
        }

        return personagemRepository.save(personagem);
    }
    
    
    //Fim Personagem
    
    // Pericias chato pra krl
    

    @Autowired
    private PericiasRepository periciaRepository;
    
    @GetMapping("/pericias")
    public Iterable<Pericia> obterPericias() {
        return periciaRepository.findAll();
    }   
    
    
    
}