package pin.loocks.domain.dtos;

import java.sql.Date;
import java.util.List;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import pin.loocks.domain.enums.Estacion;
import pin.loocks.domain.enums.TipoArticulo;
import pin.loocks.domain.models.PorcentajeColor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArticuloUploadRequestDTO {
  private String nombre;
  private String marca;
  private Date fechaCompra;
  private List<String> tags;

  @NotNull
  private List<PorcentajeColor> colores;

  @NotNull
  private Estacion estacion;

  @NotNull
  private String base64Img;

  @NotNull
  private TipoArticulo tipo = TipoArticulo.TODOS;
}
