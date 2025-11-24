package pin.loocks.domain.dtos;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import pin.loocks.domain.enums.Estacion;
import pin.loocks.domain.enums.Estilo;
import pin.loocks.domain.models.Articulo;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateOutfitRequestDTO {
  private Estacion estacion;
  private Estilo estilo;
  private List<Articulo> articulos;
}
