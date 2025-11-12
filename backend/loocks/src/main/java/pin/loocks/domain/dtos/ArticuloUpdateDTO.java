package pin.loocks.domain.dtos;

import java.util.List;

import lombok.Data;
import pin.loocks.domain.enums.TipoArticulo;

@Data
public class ArticuloUpdateDTO {
  private String nombre;
  private String marca;
  private String colorPrimario;
  private List<String> coloresSecundarios;
  private String estacion; // name of enum or null
  private String fechaUltimoUso; // YYYY-MM-DD or null
  private Integer usos;
  private Long armarioId;
  private List<Long> tagsIds;
  private String imageUrl;
  private TipoArticulo tipo;
}
