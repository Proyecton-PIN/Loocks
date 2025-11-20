package pin.loocks.domain.models;

import java.sql.Date;
import java.util.List;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.ElementCollection;
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
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pin.loocks.domain.dtos.ArticuloUploadRequestDTO;
import pin.loocks.domain.enums.Estacion;
import pin.loocks.domain.enums.Estilo;
import pin.loocks.domain.enums.Zona;
import pin.loocks.logic.converters.ColorPorcentajeListConverter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
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

  @JdbcTypeCode(SqlTypes.JSON)
  @Column(columnDefinition = "jsonb")
  @Convert(converter = ColorPorcentajeListConverter.class)
  private List<PorcentajeColor> colores;

  private Boolean puedePonerseEncimaDeOtraPrenda = false;

  @Column(nullable = false)
  private String colorPrimario;

  @Enumerated(EnumType.STRING)
  private Estacion estacion;

  @Enumerated(EnumType.STRING)
  private Estilo estilo;

  @ElementCollection
  private List<Zona> zonasCubiertas;

  @Temporal(TemporalType.DATE)
  private Date fechaUltimoUso;

  private Double nivelDeAbrigo = 0.5;

  @Column(nullable = false, columnDefinition = "INTEGER DEFAULT 0")
  private Integer usos = 0;

  @ManyToMany
  @JoinTable(name = "articulo_outfit")
  private List<Outfit> outfits;

  @ManyToOne
  @JoinColumn(name = "armario_id", nullable = false)
  @JsonIgnore
  private Armario armario;

  @OneToMany(cascade = CascadeType.ALL, mappedBy = "articulo")
  @JsonIgnore
  private List<Prestamo> prestamos;

  // @ManyToMany
  // @JoinTable(name = "articulo_tag")
  // private List<Tag> tags;

  @Column(nullable = false)
  @JsonIgnore
  private String userId;

  private Boolean isFavorito = false;

  @Column(nullable = false)
  private String imageUrl;

  // @Enumerated(EnumType.STRING)
  // @Column(nullable = false)
  // private TipoArticulo tipo = TipoArticulo.TODOS;

  public Articulo(ArticuloUploadRequestDTO dto) {
    this.nombre = dto.getNombre();
    this.marca = dto.getMarca();
    this.fechaCompra = dto.getFechaCompra();
    this.colores = dto.getColores();
    this.estacion = dto.getEstacion();
    this.estilo = dto.getEstilo();
    this.zonasCubiertas = dto.getZonasCubiertas();
    this.puedePonerseEncimaDeOtraPrenda = dto.getPuedePonerseEncimaDeOtraPrenda();
  }

}