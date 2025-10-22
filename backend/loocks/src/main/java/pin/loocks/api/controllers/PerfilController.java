package pin.loocks.api.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import pin.loocks.api.config.JwtTokenProvider;
import pin.loocks.domain.dtos.LoginRequestDTO;
import pin.loocks.domain.dtos.TokenResponseDTO;

@RestController
@RequestMapping("/api/auth")
public class PerfilController {
  private final AuthenticationManager authenticationManager;
  private final JwtTokenProvider jwtTokenProvider;

  public PerfilController(AuthenticationManager authenticationManager, JwtTokenProvider jwtTokenProvider) {
    this.authenticationManager = authenticationManager;
    this.jwtTokenProvider = jwtTokenProvider;
  }

  @PostMapping("/login")
    public ResponseEntity<TokenResponseDTO> login(@RequestBody LoginRequestDTO loginRequest) {
      Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
      
      String token = jwtTokenProvider.generateToken(authentication);

      return ResponseEntity.ok(new TokenResponseDTO(token));
    }
}
