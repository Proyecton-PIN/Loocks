package pin.loocks.data.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import pin.loocks.domain.models.Outfit;
import java.util.List;

public interface OutfitRepository extends JpaRepository<Outfit, Long> {
    List<Outfit> findByPerfilId(String perfilId);
}
