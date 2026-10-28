package com.ordemup.demo.tela.geradorPersonagem;

import java.util.Random;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class GeradorPersonagem {

	//Basico
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	
	private String nome;
	private String nomeMeio;
	private String sobreNome;
	private int idade;
	
	//Caracteristicas de personalidade
	private String sotaque;
	private String personalidade;
	private String qualidade;
	private String defeito;
	
	//Caracteisticas fisicas
	private double altura;
	private double peso;
	private String corCabelo;
	private String corPele;
	private String corOlho;
	private String camisa;
	private String calca;
	private String sapato;
	private String exprecaoRosto;
	private String CaracteristicaMarcante;
	
	public GeradorPersonagem() {
		// TODO Auto-generated constructor stub
	}
	
	public GeradorPersonagem(long id, String nome, String nomeMeio, String sobreNome, int idade, String sotaque,
			String personalidade, String qualidade, String defeito, double altura, double peso, String corCabelo,
			String corPele, String corOlho, String camisa, String calca, String sapato, String exprecaoRosto,
			String caracteristicaMarcante) {
		this.id = id;
		this.nome = nome;
		this.nomeMeio = nomeMeio;
		this.sobreNome = sobreNome;
		this.idade = idade;
		this.sotaque = sotaque;
		this.personalidade = personalidade;
		this.qualidade = qualidade;
		this.defeito = defeito;
		this.altura = altura;
		this.peso = peso;
		this.corCabelo = corCabelo;
		this.corPele = corPele;
		this.corOlho = corOlho;
		this.camisa = camisa;
		this.calca = calca;
		this.sapato = sapato;
		this.exprecaoRosto = exprecaoRosto;
		CaracteristicaMarcante = caracteristicaMarcante;
	}


	public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
	}
	public String getNome() {
		return nome;
	}
	public void setNome(String nome) {
		this.nome = nome;
	}
	public String getNomeMeio() {
		return nomeMeio;
	}
	public void setNomeMeio(String nomeMeio) {
		this.nomeMeio = nomeMeio;
	}
	public String getSobreNome() {
		return sobreNome;
	}
	public void setSobreNome(String sobreNome) {
		this.sobreNome = sobreNome;
	}
	public int getIdade() {
		return idade;
	}
	public void setIdade(int idade) {
		this.idade = idade;
	}
	public String getSotaque() {
		return sotaque;
	}
	public void setSotaque(String sotaque) {
		this.sotaque = sotaque;
	}
	public String getPersonalidade() {
		return personalidade;
	}
	public void setPersonalidade(String personalidade) {
		this.personalidade = personalidade;
	}
	public String getQualidade() {
		return qualidade;
	}
	public void setQualidade(String qualidade) {
		this.qualidade = qualidade;
	}
	public String getDefeito() {
		return defeito;
	}
	public void setDefeito(String defeito) {
		this.defeito = defeito;
	}
	public double getAltura() {
		return altura;
	}
	public void setAltura(double altura) {
		this.altura = altura;
	}
	public double getPeso() {
		return peso;
	}
	public void setPeso(double peso) {
		this.peso = peso;
	}
	public String getCorCabelo() {
		return corCabelo;
	}
	public void setCorCabelo(String corCabelo) {
		this.corCabelo = corCabelo;
	}
	public String getCorPele() {
		return corPele;
	}
	public void setCorPele(String corPele) {
		this.corPele = corPele;
	}
	public String getCorOlho() {
		return corOlho;
	}
	public void setCorOlho(String corOlho) {
		this.corOlho = corOlho;
	}
	public String getCamisa() {
		return camisa;
	}
	public void setCamisa(String camisa) {
		this.camisa = camisa;
	}
	public String getCalca() {
		return calca;
	}
	public void setCalca(String calca) {
		this.calca = calca;
	}
	public String getSapato() {
		return sapato;
	}
	public void setSapato(String sapato) {
		this.sapato = sapato;
	}
	public String getExprecaoRosto() {
		return exprecaoRosto;
	}
	public void setExprecaoRosto(String exprecaoRosto) {
		this.exprecaoRosto = exprecaoRosto;
	}
	public String getCaracteristicaMarcante() {
		return CaracteristicaMarcante;
	}
	public void setCaracteristicaMarcante(String caracteristicaMarcante) {
		CaracteristicaMarcante = caracteristicaMarcante;
	}
	
	
	Random random = new Random();
	
	//private final GeradorPersonagemRepository geradorPersonagemRepository;
	
//	public GeradorPersonagem gerarPersonagem() {
//		
//		List<GeradorPersonagem> registros = (List<GeradorPersonagem>) geradorPersonagemRepository.findAll();
//		
//		String nome = registros.get(random.nextInt(registros.size())).getNome();
//		String sobrenome = registros.get(random.nextInt(registros.size())).getSobreNome();
//		String nomeMeio = registros.get(random.nextInt(registros.size())).getNomeMeio();
//		String sotaque = registros.get(random.nextInt(registros.size())).getSotaque();
//		String personalidade = registros.get(random.nextInt(registros.size())).getPersonalidade();
//		String qualidade = registros.get(random.nextInt(registros.size())).getQualidade();
//		String defeito = registros.get(random.nextInt(registros.size())).getDefeito();
//		String corCabelo = registros.get(random.nextInt(registros.size())).getCorCabelo();
//		String corPele = registros.get(random.nextInt(registros.size())).getCorPele();
//		String corOlho = registros.get(random.nextInt(registros.size())).getCorOlho();
//		String camisa = registros.get(random.nextInt(registros.size())).getCamisa();
//		String calca = registros.get(random.nextInt(registros.size())).getCalca();
//		String sapato = registros.get(random.nextInt(registros.size())).getSapato();
//		String exprecaoRosto = registros.get(random.nextInt(registros.size())).getExprecaoRosto();
//		String caracteristicaMarcante = registros.get(random.nextInt(registros.size())).getCaracteristicaMarcante();
//
//		int idade = random.nextInt(18, 61);
//		
//		double altura = random.nextDouble(1.50, 2.10);
//		double peso = random.nextDouble(40.0, 150.0);
//		
//		GeradorPersonagem personagem = new GeradorPersonagem();
//		
//		personagem.setNome(nome);
//		personagem.setSobreNome(sobrenome);
//		personagem.setNomeMeio(nomeMeio);
//		personagem.setSotaque(sotaque);
//		personagem.setPersonalidade(personalidade);
//		personagem.setQualidade(qualidade);
//		personagem.setDefeito(defeito);
//		personagem.setCorCabelo(corCabelo);
//		personagem.setCorPele(corPele);
//		personagem.setCorOlho(corOlho);
//		personagem.setCamisa(camisa);
//		personagem.setCalca(calca);
//		personagem.setSapato(sapato);
//		personagem.setExprecaoRosto(exprecaoRosto);
//		personagem.setCaracteristicaMarcante(caracteristicaMarcante);
//		personagem.setIdade(idade);
//		personagem.setAltura(altura);
//		personagem.setPeso(peso);
//
//		return personagem;
//
//	}
	
	
	
}
