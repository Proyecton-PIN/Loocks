package pin.loocks.data.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import pin.loocks.domain.models.OutfitLog;

public interface OutfitLogRepository extends JpaRepository<OutfitLog, Long> {
  @Query("""
      SELECT ol FROM OutfitLog ol
      WHERE ol.outfit.perfil.id = :perfilId
      """)
  public List<OutfitLog> findAllByPerfilId(@Param("perfilId") String perfilId);
}
