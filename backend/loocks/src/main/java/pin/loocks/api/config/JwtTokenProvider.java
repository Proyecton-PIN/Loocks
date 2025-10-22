package pin.loocks.api.config;

import java.util.Date;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Component
public class JwtTokenProvider {
  private final String jwtSecret = "claveSuperSecretaCambiala";
  private final long jwtExpirationMs = 86400000; // 1 día

  public String generateToken(Authentication authentication) {
    String email = authentication.getName();
    Date now = new Date();
    Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

    return Jwts.builder()
      .setSubject(email)
      .setIssuedAt(now)
      .setExpiration(expiryDate)
      .signWith(SignatureAlgorithm.HS512, jwtSecret)
      .compact();
  }
}