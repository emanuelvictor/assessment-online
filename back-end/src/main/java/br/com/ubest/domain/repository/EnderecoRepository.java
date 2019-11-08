package br.com.ubest.domain.repository;

import br.com.ubest.domain.entity.endereco.Cidade;
import br.com.ubest.domain.entity.endereco.Endereco;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface EnderecoRepository extends JpaRepository<Endereco, Long> {

    /**
     * @param cidade
     * @param uf
     * @return
     */
    @Query("SELECT cidade FROM Cidade cidade WHERE (LOWER(cidade.nome) = LOWER(:cidade) AND LOWER(cidade.estado.uf) = LOWER(:uf))")
    Optional<Cidade> find(@Param("cidade") final String cidade, @Param("uf") final String uf);

}
