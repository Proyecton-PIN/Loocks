package pin.loocks.domain.dtos;

import java.sql.Date;
import java.util.List;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import pin.loocks.domain.enums.Estacion;
import pin.loocks.domain.enums.TipoAccesorio;
import pin.loocks.domain.enums.TipoArticulo;
import pin.loocks.domain.models.Accesorio;

@Data
public class AccesorioUploadRequestDTO {
  private String nombre;
  private String marca;
  private Date fechaCompra;
  @NotNull
  private String colorPrimario;
  @NotNull
  private List<String> coloresSecundarios;
  @NotNull
  private Estacion estacion;
  @NotNull
  private List<Long> tagsIds;
  @NotNull
  private String imageUrl;
  @NotNull
  private Long armarioId;

  @NotNull
  private TipoAccesorio tipoAccesorio;

  public Accesorio toAccesorio(){
    Accesorio result = new Accesorio();
    result.setNombre(nombre);
    result.setMarca(marca);
    result.setFechaCompra(fechaCompra);
    result.setColorPrimario(colorPrimario);
    result.setColoresSecundarios(coloresSecundarios);
    result.setEstacion(estacion);
    result.setImageUrl(imageUrl);
    result.setTipoAccesorio(tipoAccesorio);
  result.setTipo(TipoArticulo.ACCESORIO);

    return result;
  }
}
