package pin.loocks.domain.models;

import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import io.jsonwebtoken.lang.Collections;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public class CustomUserDetails implements UserDetails {
  private final Perfil perfil;

  public String getId(){
    return perfil.getId();
  }

  public String getEmail() {
    return perfil.getEmail();
  }

  public Armario getArmario() {
    return perfil.getArmario();
  }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return Collections.emptyList();
  }

  @Override
  public String getPassword() {
    return perfil.getPassword();
  }

  @Override
  public String getUsername() {
    return perfil.getEmail();
  }

  
}
