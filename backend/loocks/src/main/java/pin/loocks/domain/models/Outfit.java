package pin.loocks.domain.models;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pin.loocks.domain.enums.Estacion;
import pin.loocks.domain.enums.Estilo;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Outfit {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  // private String satisfaccion;

  // private String mood;

  @Enumerated(EnumType.STRING)
  private Estacion estacion = Estacion.ENTRETIEMPO;

  @Enumerated(EnumType.STRING)
  private Estilo estilo = Estilo.CASUAL;
  
  @Column(columnDefinition = "BOOLEAN DEFAULT FALSE")
  private boolean isFavorito;

  @ManyToMany(mappedBy = "outfits")
  private List<Articulo> articulos;

  @ManyToOne
  @JoinColumn(name = "perfil_id", nullable = false)
  @JsonIgnore
  private Perfil perfil;

  @OneToMany(mappedBy = "outfit", cascade = CascadeType.ALL)
  private List<OutfitLog> logs;

  // @ManyToMany
  // @JoinTable(name = "outfit_tag")
  // private List<Tag> tags;

  public Outfit(Articulo torso, Articulo pierna, Articulo pie) {
    this.articulos = new ArrayList<>(List.of(torso));
    if (pierna != null)
      this.articulos.add(pierna);
    if (pie != null)
      this.articulos.add(pie);
    this.estacion = torso.getEstacion();
    this.estilo = torso.getEstilo();
  }
}
