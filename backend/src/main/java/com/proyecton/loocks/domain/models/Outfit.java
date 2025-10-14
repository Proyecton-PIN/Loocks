package com.proyecton.loocks.domain.models;

import java.util.List;

import jakarta.persistence.CascadeType;
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
  
  private boolean isFavorito;

  @ManyToMany(mappedBy = "outfit")
  @JoinTable(
    name = "articulo_outfit",
    joinColumns = @JoinColumn(name = "outfit_id"),
    inverseJoinColumns = @JoinColumn(name = "articulo_id")
  )
  private List<Articulo> articulos;

  @ManyToOne(cascade = CascadeType.REMOVE)
  private Perfil perfil;

  @OneToMany(mappedBy = "outfit")
  private List<OutfitLog> logs;

  @ManyToMany(mappedBy = "outfit")
  private List<Tag> tags;
}
