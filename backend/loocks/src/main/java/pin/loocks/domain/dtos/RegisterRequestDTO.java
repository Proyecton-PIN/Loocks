package pin.loocks.domain.dtos;


import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class RegisterRequestDTO {
  private String nombre, nombreUsuario, apellidos, email, password;
  private Date fechaNacimiento;
}
