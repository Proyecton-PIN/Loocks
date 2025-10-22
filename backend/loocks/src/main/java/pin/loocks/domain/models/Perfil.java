package pin.loocks.domain.models;

import java.sql.Date;
import java.util.List;

import jakarta.persistence.CascadeType;
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
import lombok.Getter;

@Getter
@Entity
public class Perfil {
  @Id
  @GeneratedValue(strategy =  GenerationType.UUID)
  private String id;

  @Column(unique = true, nullable = false)
  private String nombreUsuario;

  @Column(nullable = false)
  private String nombre;

  @Column(nullable = false)
  private String apellidos;

  @Column(nullable = false)
  private String email;

  @Column(nullable = false)
  private String password;

  private String fotoPerfilUrl;

  @Column(nullable = false)
  @Temporal(TemporalType.DATE)
  private Date fechaNacimiento;

  @OneToMany(mappedBy = "perfil", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<Armario> armarios;

  @OneToMany(mappedBy = "perfil", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<Outfit> outfits;

  @ManyToMany
  @JoinTable(
    name = "amigos",
    joinColumns = @JoinColumn(name = "perfil_id"),
    inverseJoinColumns = @JoinColumn(name = "amigo_id")
  )
  private List<Perfil> amigos;

  @OneToMany(mappedBy = "perfil", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<Planificacion> planificaciones;
}
