package pin.loocks.ui.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.AllArgsConstructor;
import pin.loocks.domain.dtos.LoginRequestDTO;
import pin.loocks.domain.dtos.RegisterRequestDTO;
import pin.loocks.domain.dtos.TokenResponseDTO;
import pin.loocks.domain.models.CustomUserDetails;
import pin.loocks.domain.models.Perfil;
import pin.loocks.logic.services.AuthService;
import pin.loocks.ui.config.JwtUtil;


@AllArgsConstructor
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
  @Autowired
  private AuthenticationManager authenticationManager;
  @Autowired
  private JwtUtil jwtUtil;
  @Autowired
  private AuthService perfilService;

  @PostMapping("/login")
  public ResponseEntity<TokenResponseDTO> login(@RequestBody LoginRequestDTO loginRequest) {
    Authentication authentication = authenticationManager.authenticate(
      new UsernamePasswordAuthenticationToken(
        loginRequest.getEmail(),
        loginRequest.getPassword()
      )
    );
    
    CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

    String token = jwtUtil.generateToken(userDetails.getEmail());

    return ResponseEntity.ok(new TokenResponseDTO(token, userDetails.getId()));
  }

  @PostMapping("/register")
  public ResponseEntity<String> registerUser(@RequestBody RegisterRequestDTO request) {
    Perfil perfil = perfilService.registerUser(request);
    
    if(perfil == null) return ResponseEntity.badRequest().build();
    return ResponseEntity.ok("User registered successfully!");
  }

  @GetMapping("/check")
  public ResponseEntity<Boolean> checkAuth(@AuthenticationPrincipal CustomUserDetails userDetails) {
    return ResponseEntity.ok(true);
  }
}
