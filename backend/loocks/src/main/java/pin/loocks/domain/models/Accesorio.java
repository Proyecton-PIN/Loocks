package pin.loocks.domain.models;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import pin.loocks.domain.enums.TipoAccesorio;

@Entity
@DiscriminatorValue("Accesorio")
public class Accesorio extends Articulo{
  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private TipoAccesorio tipoAccesorio;
}
