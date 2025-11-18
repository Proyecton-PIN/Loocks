package pin.loocks.domain.dtos;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Data;
import pin.loocks.domain.enums.Estacion;
import pin.loocks.domain.enums.TipoArticulo;
import pin.loocks.domain.models.PorcentajeColor;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class ClothingAnalysisDTO {
	private String nombre;
	private String marca;

	private List<PorcentajeColor> colores;

	private List<String> tags;
	private Estacion estacion;

	private TipoArticulo tipo;

	private String base64Img = null;
}