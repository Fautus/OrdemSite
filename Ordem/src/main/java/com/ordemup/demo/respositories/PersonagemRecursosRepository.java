package com.ordemup.demo.respositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ordemup.demo.tela.PersonagemRecursos;

public interface PersonagemRecursosRepository extends JpaRepository<PersonagemRecursos, Long> {

    // UPSERT do PostgreSQL evita colisão quando mestre e jogador iniciam juntos.
    @Modifying
    @Query(value = """
        INSERT INTO personagem_recursos
            (personagem_id, pv_atual, pv_maximo, pe_atual, pe_maximo, san_atual, san_maximo)
        VALUES (:id, 20, 20, 10, 10, 30, 30)
        ON CONFLICT (personagem_id) DO NOTHING
        """, nativeQuery = true)
    void criarSeAusente(@Param("id") Long id);

    // Cada atualização modifica apenas as colunas do recurso solicitado.
    @Modifying
    @Query(value = "UPDATE personagem_recursos SET pv_atual=:atual, pv_maximo=:maximo WHERE personagem_id=:id", nativeQuery = true)
    int atualizarPv(@Param("id") Long id, @Param("atual") int atual, @Param("maximo") int maximo);

    @Modifying
    @Query(value = "UPDATE personagem_recursos SET pe_atual=:atual, pe_maximo=:maximo WHERE personagem_id=:id", nativeQuery = true)
    int atualizarPe(@Param("id") Long id, @Param("atual") int atual, @Param("maximo") int maximo);

    @Modifying
    @Query(value = "UPDATE personagem_recursos SET san_atual=:atual, san_maximo=:maximo WHERE personagem_id=:id", nativeQuery = true)
    int atualizarSan(@Param("id") Long id, @Param("atual") int atual, @Param("maximo") int maximo);
}
