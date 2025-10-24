package pin.loocks.domain.dtos;


import java.sql.Date;

import org.springframework.security.crypto.password.PasswordEncoder;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class RegisterRequestDTO {
  private String nombre, nombreUsuario, apellidos, email, password;
  private Date fechaNacimiento;

  public void encodePassword(PasswordEncoder encoder) {
    password = encoder.encode(password);
  }
}
