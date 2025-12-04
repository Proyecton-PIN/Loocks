package pin.loocks.domain.dtos;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import pin.loocks.domain.enums.Estacion;
import pin.loocks.domain.enums.Estilo;
import pin.loocks.domain.enums.TipoArticulo;
import pin.loocks.domain.enums.Zona;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FilterRequestDTO {
  private int offset = 0;
  private int limit = 9999;

  private Estilo estilo;
  private Estacion estacion;
  private List<Zona> zonasCubiertas;
  private Boolean isFavorito;
  private String primaryColor;
  private Double nivelDeAbrigo;
  private Boolean puedePonerseEncimaDeOtraPrenda;
  private TipoArticulo tipoToAvoid;

  public FilterRequestDTO(GenerateOutfitSuggestionsRequestDTO request) {
    this.estilo = request.getEstilo();
    this.estacion = request.getEstacion();
    this.primaryColor = request.getPrimaryColor();
    this.nivelDeAbrigo = request.getNivelDeAbrigo();
  }

  public FilterRequestDTO(List<Zona> zonasCubiertas) {
    this.zonasCubiertas = zonasCubiertas;
  }
}
