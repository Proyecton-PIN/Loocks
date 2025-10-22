package pin.loocks.domain.dtos;

import lombok.Getter;

@Getter
public class TokenResponseDTO {
  private String token;

  public TokenResponseDTO(String token){
    this.token = token;
  }
}
