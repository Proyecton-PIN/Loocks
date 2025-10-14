package com.proyecton.loocks.domain.models;

import java.sql.Date;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

@Entity
public class Perfil {
  @Id
  @GeneratedValue(strategy =  GenerationType.UUID)
  private Long id;
  @Column(unique = true)
  private String nombreUsuario;
  private String nombre;
  private String apellidos;
  private String email;
  private String password;
  private String fotoPerfilUrl;
  @Temporal(TemporalType.DATE)
  private Date fechaNacimiento;

  @OneToMany(mappedBy = "perfil")
  private List<Armario> armarios;

  @OneToMany(mappedBy = "perfil")
  private List<Outfit> outifts;

  @ManyToMany()
  @JoinTable(
    name = "amigos",
    joinColumns = @JoinColumn(name = "perfil_id"),
    inverseJoinColumns = @JoinColumn(name = "amigo_id")
  )
  private List<Perfil> amigos;

  @OneToMany(mappedBy = "perfil")
  private List<Planificacion> planificaciones;
}
