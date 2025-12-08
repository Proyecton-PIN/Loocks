package pin.loocks.data.repositories;

import java.sql.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import pin.loocks.domain.models.Planificacion;

@Repository
public interface PlanificacionRepository extends JpaRepository<Planificacion, Long> {
    List<Planificacion> findByPerfilId(String perfilId);

    @Query("SELECT p FROM Planificacion p WHERE p.perfil.id = :userId AND " +
           "((p.fechaInicio BETWEEN :start AND :end) OR " +
           "(p.fechaFin BETWEEN :start AND :end))")
    List<Planificacion> findByUserIdAndRange(@Param("userId") String userId, 
                                             @Param("start") Date start, 
                                             @Param("end") Date end);
}