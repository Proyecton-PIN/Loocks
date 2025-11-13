package pin.loocks.domain.dtos;

import java.sql.Date;
import java.util.List;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import pin.loocks.domain.enums.Estacion;
import pin.loocks.domain.models.Articulo;

@Data
public class ArticuloUploadRequestDTO {
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

  public Articulo toArticulo(){
    Articulo result = new Articulo();
    result.setNombre(nombre);
    result.setMarca(marca);
    result.setFechaCompra(fechaCompra);
    result.setEstacion(estacion);
    result.setImageUrl(imageUrl);

    return result;
  }
}
