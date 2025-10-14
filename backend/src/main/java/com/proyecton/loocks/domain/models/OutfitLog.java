package com.proyecton.loocks.domain.models;

import java.sql.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

@Entity
public class OutfitLog {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Temporal(TemporalType.DATE)
  private Date fechaInicio;
  
  @Column(nullable = true)
  @Temporal(TemporalType.DATE)
  private Date fechaFin;

  @ManyToOne
  private Planificacion planificacion;

  @ManyToOne
  private Outfit outfit;
}
