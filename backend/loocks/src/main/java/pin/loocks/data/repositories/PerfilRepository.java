package pin.loocks.data.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import pin.loocks.domain.models.Perfil;

public interface PerfilRepository extends JpaRepository<Perfil, String>  {
  Perfil getByEmail(String email);
  boolean existsByEmail(String email);
}
