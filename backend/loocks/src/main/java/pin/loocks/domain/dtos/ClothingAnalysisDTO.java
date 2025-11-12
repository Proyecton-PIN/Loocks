package pin.loocks.domain.dtos;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class ClothingAnalysisDTO {
    // Basic identification
    private String nombre;
    private String marca;

    // Colors
    private String primaryColor; // e.g. "#RRGGBB"
    private List<String> coloresSecundarios; // e.g. ["#FFFFFF"]
    private List<ColorInfo> colors; // list of color + percentage

    // Tags / seasons
    private List<String> tags;
    private List<String> seassons;

    // Clothing vs accessory
    // tipoArticulo should be one of: ARTICULO, PRENDA, ACCESORIO
    private String tipoArticulo;
    private String type; // one of TipoPrenda or TipoAccesorio names

    // Optional metadata (dates as strings or "no identificado")
    private String fechaCompra;
    private String fechaUltimoUso;
    private String usos; // integer as string or "no identificado"

    // Storage/user info (can be "no identificado")
    private String userId;
    private String imageUrl;
    private String tipo; // ARTICULO | PRENDA | ACCESORIO

    @Data
    public static class ColorInfo {
        private String color;
        private int percentage;
    }
}