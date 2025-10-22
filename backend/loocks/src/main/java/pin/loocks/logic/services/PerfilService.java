package pin.loocks.logic.services;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import pin.loocks.data.repositories.PerfilRepository;
import pin.loocks.domain.models.Perfil;

@Service
public class PerfilService implements UserDetailsService {
  private final PerfilRepository perfilRepository;

  PerfilService(PerfilRepository repo){
    this.perfilRepository = repo;
  }

  @Override
  public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
    Perfil perfil = perfilRepository.getByEmail(email)
      .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con email: " + email));

    return User.builder()
      .username(perfil.getEmail())
      .password(perfil.getPassword())
      .authorities("ROLE_USER")
      .build();
  }
}
