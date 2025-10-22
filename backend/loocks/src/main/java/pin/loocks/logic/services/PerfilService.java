package pin.loocks.logic.services;

import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import pin.loocks.data.repositories.PerfilRepository;
import pin.loocks.domain.models.Perfil;

@Service
public class PerfilService implements UserDetailsService {
  @Autowired
  private final PerfilRepository perfilRepository;

  PerfilService(PerfilRepository repo){
    this.perfilRepository = repo;
  }

  @Override
  public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
    Perfil perfil = perfilRepository.getByEmail(email);
    
    if(perfil == null){
      throw new UsernameNotFoundException("Email no encontrado: " + email);
    }

    return new org.springframework.security.core.userdetails.User(
      perfil.getEmail(),
      perfil.getPassword(),
      Collections.emptyList()
    );
  }
}