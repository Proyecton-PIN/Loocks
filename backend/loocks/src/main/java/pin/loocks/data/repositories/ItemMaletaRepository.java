package pin.loocks.data.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pin.loocks.domain.models.ItemMaleta;
import java.util.List;

@Repository
public interface ItemMaletaRepository extends JpaRepository<ItemMaleta, Long> {
    List<ItemMaleta> findByPlanificacionIdOrderByIdDesc(Long planId);
}