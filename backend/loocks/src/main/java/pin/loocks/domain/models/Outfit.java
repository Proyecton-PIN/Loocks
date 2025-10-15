package pin.loocks.domain.models;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

@Entity
public class Outfit {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String satisfaccion;

  private String mood;
  
  @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE")
  private boolean isFavorito;

  @ManyToMany(mappedBy = "outfits")
  private List<Articulo> articulos;

  @ManyToOne
  @JoinColumn(name = "perfil_id", nullable = false)
  private Perfil perfil;

  @OneToMany(mappedBy = "outfit", cascade = CascadeType.ALL)
  private List<OutfitLog> logs;

  @ManyToMany
  @JoinTable(name = "outfit_tag")
  private List<Tag> tags;
}
