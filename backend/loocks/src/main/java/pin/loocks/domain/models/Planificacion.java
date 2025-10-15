package pin.loocks.domain.models;

import java.sql.Date;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

@Entity
public class Planificacion {
  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE)
  private Long id;
 
  @Column(nullable = false)
  @Temporal(TemporalType.DATE)
  private Date fecahInicio;
 
  @Column(nullable = false)
  @Temporal(TemporalType.DATE)
  private Date fechaFin;

  @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT TRUE")
  private boolean isMaleta;

  @OneToMany(mappedBy = "planificacion", cascade = CascadeType.REFRESH)
  private List<OutfitLog> outfitLogs;

  @ManyToOne
  @JoinColumn(name = "perfil_id", nullable = false)
  private Perfil perfil;
}
