package pin.loocks.data.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import pin.loocks.domain.models.Articulo;

/**
 * Repository for Articulo entities.
 * Provides basic query methods used by the service/controller layer.
 */
public interface ArticuloRepository extends JpaRepository<Articulo, Long> {
    List<Articulo> findByUserId(String userId);
    List<Articulo> findByArmarioId(Long armarioId);
    List<Articulo> findByColorPrimario(String colorPrimario);
    List<Articulo> findByNombreContainingIgnoreCase(String nombrePart);
}
