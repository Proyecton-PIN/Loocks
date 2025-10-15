package pin.loocks.domain.models;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;

@Entity
public class Tag {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String value;

  @ManyToMany(mappedBy = "tags")
  private List<Outfit> outfits;

  @ManyToMany(mappedBy = "tags")
  private List<Articulo> articulos;
}
