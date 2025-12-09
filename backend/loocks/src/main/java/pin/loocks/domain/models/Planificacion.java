package pin.loocks.domain.models;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;

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
import lombok.Getter; 
import lombok.Setter;

@Entity
@Getter 
@Setter 
public class Planificacion {
  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE)
  private Long id;
 
  @Column(nullable = false)
  @Temporal(TemporalType.DATE)
  @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy", timezone = "Europe/Madrid")
  private LocalDate fechaInicio;
 
  @Column(nullable = false)
  @Temporal(TemporalType.DATE)
  @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy", timezone = "Europe/Madrid")
  private LocalDate fechaFin;

  @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT TRUE")
  private boolean isMaleta;

  private String titulo;

  private String ubicacion;
  
  private Double temperaturaMedia;

  @OneToMany(mappedBy = "planificacion", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<OutfitLog> outfitLogs;

  @ManyToOne
  @JoinColumn(name = "perfil_id", nullable = false)
  @JsonIgnore
  private Perfil perfil;
}