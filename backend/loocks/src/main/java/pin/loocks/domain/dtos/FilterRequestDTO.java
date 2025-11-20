package pin.loocks.domain.dtos;

import java.util.List;

import lombok.Data;
import pin.loocks.domain.enums.Estacion;
import pin.loocks.domain.enums.Estilo;
import pin.loocks.domain.enums.Zona;

@Data
public class FilterRequestDTO {
  private int offset = 0;
  private int limit;

  private Estilo estilo;
  private Estacion estacion;
  private List<Zona> zonasCubiertas;
  private Boolean isFavorito;
  private String primaryColor;
  private Double nivelDeAbrigo;
  private Boolean puedePonerseEncimaDeOtraPrenda;
}
