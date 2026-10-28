package com.ordemup.demo.tela.geradorPersonagem;

import java.util.List;
import java.util.Random;
import java.util.function.Function;

import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import com.ordemup.demo.respositories.GeradorPersonagemRepository;

@Service
public class GeradorPersonagemService {

    private final GeradorPersonagemRepository repository;
    private final Random random = new Random();

    public GeradorPersonagemService(GeradorPersonagemRepository repository) {
        this.repository = repository;
    }

    public GeradorPersonagem gerarPersonagem(int idadeMin, int idadeMax) {
        List<GeradorPersonagem> registros = (List<GeradorPersonagem>) repository.findAll();
        if (registros.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Não existem registros em gerador_personagem.");
        }

        GeradorPersonagem personagem = new GeradorPersonagem();

        // Cada atributo textual é sorteado independentemente dos demais.
        // Registros sem valor nessa coluna são ignorados.
        personagem.setNome(sortear(registros, GeradorPersonagem::getNome));
        personagem.setNomeMeio(sortear(registros, GeradorPersonagem::getNomeMeio));
        personagem.setSobreNome(sortear(registros, GeradorPersonagem::getSobreNome));
        personagem.setSotaque(sortear(registros, GeradorPersonagem::getSotaque));
        personagem.setPersonalidade(sortear(registros, GeradorPersonagem::getPersonalidade));
        personagem.setQualidade(sortear(registros, GeradorPersonagem::getQualidade));
        personagem.setDefeito(sortear(registros, GeradorPersonagem::getDefeito));
        personagem.setCorCabelo(sortear(registros, GeradorPersonagem::getCorCabelo));
        personagem.setCorPele(sortear(registros, GeradorPersonagem::getCorPele));
        personagem.setCorOlho(sortear(registros, GeradorPersonagem::getCorOlho));
        personagem.setCamisa(sortear(registros, GeradorPersonagem::getCamisa));
        personagem.setCalca(sortear(registros, GeradorPersonagem::getCalca));
        personagem.setSapato(sortear(registros, GeradorPersonagem::getSapato));
        personagem.setExprecaoRosto(sortear(registros, GeradorPersonagem::getExprecaoRosto));
        personagem.setCaracteristicaMarcante(
                sortear(registros, GeradorPersonagem::getCaracteristicaMarcante));

        personagem.setIdade(random.nextInt(idadeMin, idadeMax + 1));
        personagem.setAltura(Math.round(random.nextDouble(1.50, 2.10) * 100) / 100.0);
        personagem.setPeso(Math.round(random.nextDouble(40.0, 150.0) * 10) / 10.0);

        // NÃO chama repository.save(): a geração é somente leitura.
        return personagem;
    }

    private String sortear(List<GeradorPersonagem> registros,
            Function<GeradorPersonagem, String> extrair) {
        List<String> opcoes = registros.stream()
                .map(extrair)
                .filter(valor -> valor != null && !valor.isBlank())
                .toList();
        return opcoes.isEmpty()
                ? "Não informado"
                : opcoes.get(random.nextInt(opcoes.size()));
    }
}
