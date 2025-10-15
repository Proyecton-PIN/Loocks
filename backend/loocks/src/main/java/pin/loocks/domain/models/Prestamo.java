package pin.loocks.domain.models;

import java.sql.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import pin.loocks.domain.enums.EstadoPrestamo;

@Entity
public class Prestamo {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  
  @Column(nullable = false)
  private Date fechaInicio;
  
  @Enumerated(EnumType.STRING)
  private EstadoPrestamo estado = EstadoPrestamo.EN_ESPERA;

  @ManyToOne
  @JoinColumn(name = "armario_id", nullable = false)
  private Armario armario;

  @ManyToOne
  @JoinColumn(name = "articulo_id", nullable = false)
  private Articulo articulo;

  @ManyToOne
  @JoinColumn(name = "perfil_from_id", nullable = false)
  private Perfil from;

  @ManyToOne
  @JoinColumn(name = "perfil_to_id", nullable = false)
  private Perfil to;
}
