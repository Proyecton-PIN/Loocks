package pin.loocks.domain.dtos;

import java.util.List;

import lombok.Data;
import pin.loocks.domain.enums.Estacion;
import pin.loocks.domain.enums.Estilo;
import pin.loocks.domain.models.Articulo;
import pin.loocks.domain.models.Outfit;

@Data
public class GenerateOutfitSuggestionsRequestDTO {
  private List<Outfit> outfitsBaneados;
  private Double temperatura;
  private Estilo estilo;
  private Estacion estacion;
  private Articulo prendaBase;
  private Double nivelDeAbrigo;
  private String primaryColor;
  private int limit = 5;
}
