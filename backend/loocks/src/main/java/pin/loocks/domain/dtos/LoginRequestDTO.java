package pin.loocks.domain.dtos;

import org.springframework.security.crypto.password.PasswordEncoder;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequestDTO {
  private String email;
  private String password;

  public void encodePassword(PasswordEncoder encoder) {
    password = encoder.encode(password);
  }
}
