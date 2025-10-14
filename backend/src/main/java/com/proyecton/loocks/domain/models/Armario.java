package com.proyecton.loocks.domain.models;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

@Entity
public class Armario {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  private String nombre;

  @OneToMany(mappedBy = "armario")
  private List<Articulo> articulos;

  @OneToMany(mappedBy = "armario")
  private List<Prestamo> prestamos;

  @ManyToOne(cascade = CascadeType.REMOVE)
  private Perfil perfil;
}
