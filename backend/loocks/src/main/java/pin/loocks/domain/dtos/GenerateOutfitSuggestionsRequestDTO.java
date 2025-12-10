package pin.loocks.domain.dtos;

import java.util.List;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import pin.loocks.domain.enums.Estacion;
import pin.loocks.domain.enums.Estilo;
import pin.loocks.domain.models.Articulo;

@Data
@Getter
@Setter
public class GenerateOutfitSuggestionsRequestDTO {
  // private List<Outfit> outfitsBaneados;
  private Boolean canRepeatTorso = false;
  private List<Long> articulosBaneados;
  private Double temperatura;
  private Estilo estilo;
  private Estacion estacion;
  private Articulo prendaBase;
  private Double nivelDeAbrigo;
  private String primaryColor;
  private int limit = 5;
}
