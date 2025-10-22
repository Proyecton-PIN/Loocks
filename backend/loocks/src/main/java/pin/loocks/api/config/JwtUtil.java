package pin.loocks.api.config;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;

@Component
public class JwtUtil {
  @Value("${jwt.secret}")
  private String jwtSecret;
  private int jwtExpirationMs = 60000 * 60 * 24 * 30;
  private SecretKey key;

  @PostConstruct
  void init() {
    this.key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
  }

  public String generateToken(String value) {
    return Jwts.builder()
      .setSubject(value)
      .setIssuedAt(new Date())
      .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
      .signWith(SignatureAlgorithm.HS256, key)
      .compact();
  }

  public String getEmailFromToken(String token) {
    return Jwts.parser()
      .setSigningKey(key)
      .parseClaimsJws(token)
      .getBody()
      .getSubject();
  }

  public boolean validateJwtToken(String token) {
    try {
      Jwts
        .parser()
        .setSigningKey(key)
        .parseClaimsJws(token);
      return true;
    } catch (SecurityException e) {
      System.out.println("Invalid JWT signature: " + e.getMessage());
    } catch (MalformedJwtException e) {
      System.out.println("Invalid JWT token: " + e.getMessage());
    } catch (ExpiredJwtException e) {
      System.out.println("JWT token is expired: " + e.getMessage());
    } catch (UnsupportedJwtException e) {
      System.out.println("JWT token is unsupported: " + e.getMessage());
    } catch (IllegalArgumentException e) {
      System.out.println("JWT claims string is empty: " + e.getMessage());
    }
    return false;
  }
}