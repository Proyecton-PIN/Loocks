package pin.loocks.api.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.AllArgsConstructor;
import pin.loocks.api.config.JwtUtil;
import pin.loocks.data.repositories.PerfilRepository;
import pin.loocks.domain.dtos.LoginRequestDTO;
import pin.loocks.domain.dtos.RegisterRequestDTO;
import pin.loocks.domain.dtos.TokenResponseDTO;
import pin.loocks.domain.models.Perfil;

@AllArgsConstructor
@RestController
@RequestMapping("/api/auth")
public class PerfilController {
  @Autowired
  private final AuthenticationManager authenticationManager;
  @Autowired
  private final JwtUtil jwtUtil;
  @Autowired
  PerfilRepository perfilRepository;

  @PostMapping("/login")
  public ResponseEntity<TokenResponseDTO> login(@RequestBody LoginRequestDTO loginRequest) {
    Authentication authentication = authenticationManager.authenticate(
      new UsernamePasswordAuthenticationToken(
        loginRequest.getEmail(),
        loginRequest.getPassword()
      )
    );
    
    UserDetails userDetails = (UserDetails) authentication.getPrincipal();
    String token = jwtUtil.generateToken(userDetails.getUsername());

    return ResponseEntity.ok(new TokenResponseDTO(token));
  }

  @PostMapping("/register")
  public ResponseEntity<String> registerUser(@RequestBody RegisterRequestDTO request) {
    if (perfilRepository.existsByEmail(request.getEmail())) {
      return ResponseEntity.badRequest().build();
    }
  
    Perfil newPerfil = new Perfil(request);

    perfilRepository.save(newPerfil);
    return ResponseEntity.ok("User registered successfully!");
  }
}
