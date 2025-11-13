package pin.loocks.data.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import pin.loocks.domain.models.Articulo;

public interface ArticuloRepository extends JpaRepository<Articulo, Long> {
    List<Articulo> findByUserId(String userId);
    List<Articulo> findByArmarioId(Long armarioId);
    List<Articulo> findByNombreContainingIgnoreCase(String nombrePart);
}
