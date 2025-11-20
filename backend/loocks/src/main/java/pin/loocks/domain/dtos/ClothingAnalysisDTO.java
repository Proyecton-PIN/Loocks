package pin.loocks.domain.dtos;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Data;
import pin.loocks.domain.enums.Estacion;
import pin.loocks.domain.enums.Estilo;
import pin.loocks.domain.enums.Zona;
import pin.loocks.domain.models.PorcentajeColor;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class ClothingAnalysisDTO {
	private String nombre;
	private String marca;

	private String colorPrimario;
	private List<PorcentajeColor> colores;

	private Estilo estilo;
	private Estacion estacion;
	private List<Zona> zonasCubiertas;
	private Boolean puedePonerseEncimaDeOtraPrenda;

	private Double nivelDeAbrigo;
	private String base64Img = null;
}
