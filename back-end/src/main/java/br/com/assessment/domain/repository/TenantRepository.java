package br.com.assessment.domain.repository;

import br.com.assessment.domain.entity.usuario.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TenantRepository extends JpaRepository<Tenant, Long> {

}
