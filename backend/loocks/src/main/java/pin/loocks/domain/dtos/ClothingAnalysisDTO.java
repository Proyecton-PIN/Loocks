package pin.loocks.domain.dtos;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class ClothingAnalysisDTO {
    private String primaryColor;
    private List<ColorInfo> colors;
    private List<String> tags;
    private List<String> seassons;
    @JsonProperty("isPrenda")
    private boolean isPrenda;
    private String type;
    
    @Data
    public static class ColorInfo {
        private String color;
        private int percentage;
    }
}