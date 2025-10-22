package pin.loocks.domain.dtos;

import lombok.Getter;

@Getter
public class LoginRequestDTO {
  private String email;
  private String password;

  public LoginRequestDTO(String email, String password){
    this.email = email;
    this.password = password;
  }
}
