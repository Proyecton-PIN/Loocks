package pin.loocks.data.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import pin.loocks.domain.models.Armario;

public interface ArmarioRepository extends JpaRepository<Armario, Long>  {
}
