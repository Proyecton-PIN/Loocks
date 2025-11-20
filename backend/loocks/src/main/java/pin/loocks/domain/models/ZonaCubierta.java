package pin.loocks.domain.models;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.ManyToMany;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pin.loocks.domain.enums.Zona;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ZonaCubierta {
  @Enumerated(EnumType.STRING)
  private Zona zona;

  @ManyToMany(mappedBy = "zonacubierta")
  @JsonIgnore
  private List<Articulo> articulos;
}
