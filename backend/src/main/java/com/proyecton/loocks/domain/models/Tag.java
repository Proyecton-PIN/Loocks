package com.proyecton.loocks.domain.models;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;

@Entity
public class Tag {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String value;

  @ManyToMany
  @JoinTable(
    name = "outfit_tag",
    joinColumns = @JoinColumn(name = "outfit_id"),
    inverseJoinColumns = @JoinColumn(name = "tag_id")
  )
  private List<Outfit> outfits;

  @ManyToMany
  @JoinTable(
    name = "articulo_tag",
    joinColumns = @JoinColumn(name = "articulo_id"),
    inverseJoinColumns = @JoinColumn(name = "tag_id")
  )
  private List<Articulo> articulos;
}
