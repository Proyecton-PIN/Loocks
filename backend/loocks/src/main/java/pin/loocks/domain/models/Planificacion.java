package pin.loocks.domain.models;

import java.sql.Date;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

@Entity
public class Planificacion {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @Temporal(TemporalType.DATE)
  private Date fecahInicio;
  @Temporal(TemporalType.DATE)
  private Date fechaFin;
  private boolean isMaleta;

  @OneToMany(mappedBy = "planificacion")
  private List<OutfitLog> outfitLogs;

  @ManyToOne
  private Perfil perfil;
}
