package pin.loocks.data.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import pin.loocks.domain.models.Outfit;

public interface OutfitRepository extends JpaRepository<Outfit, Long>, JpaSpecificationExecutor<Outfit> {
    List<Outfit> findByPerfilId(String perfilId);
    long countByPerfilId(String perfilId);
}
