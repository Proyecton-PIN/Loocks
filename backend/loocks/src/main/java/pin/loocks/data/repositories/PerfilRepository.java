package pin.loocks.data.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import pin.loocks.domain.models.Perfil;

public interface PerfilRepository extends JpaRepository<Perfil, String>  {
  Optional<Perfil> getByEmail(String email);
}
