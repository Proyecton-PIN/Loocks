package pin.loocks.domain.dtos;

import java.sql.Date;
import java.util.List;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import pin.loocks.domain.enums.Estacion;
import pin.loocks.domain.enums.Estilo;
import pin.loocks.domain.enums.Zona;
import pin.loocks.domain.models.PorcentajeColor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArticuloUploadRequestDTO {
  private String nombre;
  private String marca;
  private Date fechaCompra;
  // private List<String> tags;

  @NotNull
  private List<PorcentajeColor> colores;

  @NotNull
  private String colorPrimario;

  @NotNull
  private Estacion estacion;

  @NotNull
  private Estilo estilo;

  private Double nivelDeAbrigo = 0.5;

  @NotNull
  private List<Zona> zonasCubiertas;

  @NotNull
  private String base64Img;

  private Boolean puedePonerseEncimaDeOtraPrenda = false;

  private Boolean isFavorito = false;

  // @NotNull
  // private TipoArticulo tipo = TipoArticulo.TODOS;
}
