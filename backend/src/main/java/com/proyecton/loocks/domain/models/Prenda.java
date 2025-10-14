package com.proyecton.loocks.domain.models;

import com.proyecton.loocks.domain.enums.TipoPrenda;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

@Entity
@DiscriminatorValue("Prenda")
public class Prenda extends Articulo{
  @Enumerated(EnumType.STRING)
  private TipoPrenda tipo;
}
