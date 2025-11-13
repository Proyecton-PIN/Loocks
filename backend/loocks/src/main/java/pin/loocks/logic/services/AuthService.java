package pin.loocks.logic.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import pin.loocks.data.repositories.PerfilRepository;
import pin.loocks.domain.dtos.LoginRequestDTO;
import pin.loocks.domain.dtos.RegisterRequestDTO;
import pin.loocks.domain.models.Armario;
import pin.loocks.domain.models.CustomUserDetails;
import pin.loocks.domain.models.Perfil;

@Service
public class AuthService implements UserDetailsService {
  @Autowired
  private PerfilRepository perfilRepository;

  public Perfil registerUser(RegisterRequestDTO request) {
    if (perfilRepository.existsByEmail(request.getEmail())) {
      return null;
    }

    PasswordEncoder encoder = new BCryptPasswordEncoder();
    request.encodePassword(encoder);

    Perfil newPerfil = new Perfil(request);
    newPerfil.setArmario(new Armario());

    perfilRepository.save(newPerfil);
    return newPerfil;
  }

  public Perfil loginUser(LoginRequestDTO request) {
    Perfil perfil = perfilRepository.getByEmail(request.getEmail());
    if (perfil == null) return null;

    PasswordEncoder encoder = new BCryptPasswordEncoder();
    request.encodePassword(encoder);

    if(request.getPassword() != perfil.getPassword()) return null;

    return perfil;
  }

  public CustomUserDetails loadUserByEmail(String email) throws UsernameNotFoundException {
    Perfil perfil = perfilRepository.getByEmail(email);
    
    if(perfil == null){
      throw new UsernameNotFoundException("Email no encontrado: " + email);
    }

    return new CustomUserDetails(perfil);
  }

  @Override
  public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
    return loadUserByEmail(email);
  }
}