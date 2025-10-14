package com.proyecton.loocks.domain.models;

import com.proyecton.loocks.domain.enums.TipoAccesorio;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("Accesorio")
public class Accesorio extends Articulo{
  private TipoAccesorio tipo;
}
