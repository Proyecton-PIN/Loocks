package pin.loocks.domain.models;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OutfitLog {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  @JsonFormat(pattern = "dd-MM-yyyy")
  private LocalDate fechaInicio;
  
  @JsonFormat(pattern = "dd-MM-yyyy")
  private LocalDate fechaFin;

  @ManyToOne
  @JoinColumn(name = "planificacion_id")
  @JsonIgnore 
  private Planificacion planificacion;

  @ManyToOne
  @JoinColumn(name = "outfit_id", nullable = false)
  private Outfit outfit;

  public OutfitLog(Outfit outfit) {
    this.outfit = outfit;
    this.fechaInicio = LocalDate.now();
  }
}
