package pin.loocks.domain.dtos;

import java.util.List;

import lombok.Data;

@Data
public class ClothingAnalysisDTO {
    private List<ColorInfo> colors;
    private List<String> tags;
    private List<String> seassons;
    
    @Data
    public static class ColorInfo {
        private String color;
        private int percentage;
    }
}