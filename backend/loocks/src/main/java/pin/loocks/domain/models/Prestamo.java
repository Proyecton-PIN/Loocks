package pin.loocks.domain.models;

import java.sql.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import pin.loocks.domain.enums.EstadoPrestamo;

@Entity
public class Prestamo {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  
  private Date fechaInicio;
  
  private EstadoPrestamo estado;

  @ManyToOne
  private Armario armario;

  @ManyToOne
  private Articulo articulo;

  @ManyToOne
  private Perfil from;

  @ManyToOne
  private Perfil to;
}
