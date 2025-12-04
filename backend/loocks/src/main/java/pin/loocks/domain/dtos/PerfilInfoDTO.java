package pin.loocks.domain.dtos;

import java.sql.Date;

import lombok.Data;
import pin.loocks.domain.models.Perfil;

@Data
public class PerfilInfoDTO {
  private String email;
  private String nombre;
  private String apellidos;
  private String fotoPerfilUrl;
  private Date fechaNacimiento;
  private String nombreUsuario;

  public PerfilInfoDTO(Perfil p) {
    if (p == null) return;
    this.email = p.getEmail();
    this.nombre = p.getNombre();
    this.apellidos = p.getApellidos();
    this.fotoPerfilUrl = p.getFotoPerfilUrl();
    this.fechaNacimiento = p.getFechaNacimiento();
    this.nombreUsuario = p.getNombreUsuario();
  }
}
