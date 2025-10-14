package com.proyecton.loocks.domain.models;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

import com.proyecton.loocks.domain.enums.Estacion;

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
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "type")
public class Articulo {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String nombre;

  private String marca;

  @Temporal(TemporalType.DATE)
  private Date fechaCompra;

  @Column(length = 8)
  private String colorPrimario; // RRGGBBAA

  private List<String> coloresSecundarios; // RRGGBBAA
  
  @Enumerated(EnumType.ORDINAL)
  private Estacion estacion;

  private String fotoDelanteUrl;

  private String fotoTraseraUrl;

  private LocalDate fechaUltimoUso;

  private Integer usos;

  @ManyToMany
  private List<Outfit> outfits;

  @ManyToOne(cascade = CascadeType.REMOVE)
  private Armario armario;

  @OneToMany
  private List<Prestamo> prestamos;

  @ManyToMany(mappedBy = "articulo")
  private List<Tag> tags;
}
