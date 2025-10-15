package pin.loocks.domain.models;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import pin.loocks.domain.enums.TipoAccesorio;

@Entity
@DiscriminatorValue("Accesorio")
public class Accesorio extends Articulo{
  private TipoAccesorio tipo;
}
