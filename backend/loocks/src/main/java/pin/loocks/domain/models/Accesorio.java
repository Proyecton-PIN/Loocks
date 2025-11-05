package pin.loocks.domain.models;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Getter;
import lombok.Setter;
import pin.loocks.domain.enums.TipoAccesorio;

@Entity
@DiscriminatorValue("Accesorio")
@Getter
@Setter
public class Accesorio extends Articulo{
  @Enumerated(EnumType.STRING)
  @Column(nullable = true)
  private TipoAccesorio tipoAccesorio;
}
