package pin.loocks.domain.models;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorColumn;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import pin.loocks.domain.enums.Estacion;

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "type")
public class Articulo {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String nombre;

   @Column(nullable = true)
  private String marca;

  @Temporal(TemporalType.DATE)
  private Date fechaCompra;

  @Column(length = 8, nullable = false)
  private String colorPrimario; // RRGGBBAA

  @ElementCollection
  @CollectionTable(name = "articulo_colores_secundarios")
  @Column(name = "color")
  private List<String> coloresSecundarios; // RRGGBBAA
  
  @Enumerated(EnumType.ORDINAL)
  private Estacion estacion;

  private LocalDate fechaUltimoUso;

  @Column(nullable = false, columnDefinition = "INTEGER DEFAULT 0")
  private Integer usos;

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

  // Additional getters and setters to allow JSON deserialization
  public String getNombre() { return nombre; }
  public void setNombre(String nombre) { this.nombre = nombre; }

  public String getMarca() { return marca; }
  public void setMarca(String marca) { this.marca = marca; }

  public String getColorPrimario() { return colorPrimario; }
  public void setColorPrimario(String colorPrimario) { this.colorPrimario = colorPrimario; }

  public List<String> getColoresSecundarios() { return coloresSecundarios; }
  public void setColoresSecundarios(List<String> coloresSecundarios) { this.coloresSecundarios = coloresSecundarios; }

  public Armario getArmario() { return armario; }
  public void setArmario(Armario armario) { this.armario = armario; }


  //METODOS GETTERS Y SETTERS

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}
