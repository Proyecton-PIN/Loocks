package pin.loocks.data.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import pin.loocks.domain.models.Articulo;

public interface ArticuloRepository extends JpaRepository<Articulo, Long>, JpaSpecificationExecutor<Articulo> {
    List<Articulo> findByUserId(String userId);
    List<Articulo> findByArmarioId(Long armarioId);
    List<Articulo> findByNombreContainingIgnoreCase(String nombrePart);
}
