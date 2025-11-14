package pin.loocks.domain.models;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Armario {
  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE)
  private Long id;

  @Column(nullable = false)
  private String nombre;

  @OneToMany(mappedBy = "armario", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<Articulo> articulos;

  @OneToMany(mappedBy = "armario", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<Prestamo> prestamos;

  @OneToOne
  @JoinColumn(name = "perfil_id", nullable = false)
  private Perfil perfil;
}
