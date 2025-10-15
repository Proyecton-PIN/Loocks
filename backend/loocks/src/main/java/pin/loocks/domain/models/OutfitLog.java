package pin.loocks.domain.models;

import java.sql.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

@Entity
public class OutfitLog {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  @Temporal(TemporalType.DATE)
  private Date fechaInicio;
  
  @Temporal(TemporalType.DATE)
  private Date fechaFin;

  @ManyToOne
  @JoinColumn(name = "planificacion_id")
  private Planificacion planificacion;

  @ManyToOne
  @JoinColumn(name = "outfit_id", nullable = false)
  private Outfit outfit;
}
