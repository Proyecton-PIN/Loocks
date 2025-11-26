package pin.loocks.data.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import pin.loocks.domain.models.Articulo;

public interface ArticuloRepository extends JpaRepository<Articulo, Long>, JpaSpecificationExecutor<Articulo> {
    List<Articulo> findByUserId(String userId);
    List<Articulo> findByArmarioId(Long armarioId);
    List<Articulo> findByNombreContainingIgnoreCase(String nombrePart);
    List<Articulo> findByUserIdAndTipo(String userId, pin.loocks.domain.enums.TipoArticulo tipo);

    @Query("""
            SELECT a FROM Articulo a
            WHERE a.userId = :perfilId
                AND a.id IN :ids
                """)
    List<Articulo> findAllByIdsAndPerfilId(
            @Param("ids") List<Long> ids,
            @Param("perfilId") String perfilId);
}
