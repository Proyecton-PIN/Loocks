package pin.loocks.domain.models;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.Getter;
import lombok.Setter;
import pin.loocks.domain.enums.Estacion;
import pin.loocks.domain.enums.TipoArticulo;
import pin.loocks.logic.converters.ColorPorcentajeListConverter;

@Entity
@Getter
@Setter
public class Articulo {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = true)
  private String nombre;

  @Column(nullable = true)
  private String marca;

  @Temporal(TemporalType.DATE)
  private Date fechaCompra;

  @Column(columnDefinition = "jsonb") 
  @Convert(converter = ColorPorcentajeListConverter.class)
  private List<PorcentajeColor> colores;
  
  @Enumerated(EnumType.ORDINAL)
  private Estacion estacion;

  private LocalDate fechaUltimoUso;

  @Column(nullable = false, columnDefinition = "INTEGER DEFAULT 0")
  private Integer usos = 0;

  @ManyToMany
  @JoinTable(name = "articulo_outfit")
  private List<Outfit> outfits;

  @ManyToOne
  @JoinColumn(name = "armario_id", nullable = false)
  private Armario armario;

  @OneToMany(cascade = CascadeType.ALL, mappedBy = "articulo")
  private List<Prestamo> prestamos;

  @ManyToMany
  @JoinTable(name = "articulo_tag")
  private List<Tag> tags;

  @Column(nullable = false)
  private String userId;

  @Column(nullable = false)
    private String imageUrl;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private TipoArticulo tipo = TipoArticulo.TODOS;

}