package pin.loocks.logic.converters;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import pin.loocks.domain.models.PorcentajeColor;

import java.util.List;

@Converter
public class ColorPorcentajeListConverter implements AttributeConverter<List<PorcentajeColor>, String> {

    private final ObjectMapper mapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(List<PorcentajeColor> list) {
        try {
            return mapper.writeValueAsString(list);
        } catch (Exception e) {
            throw new IllegalArgumentException("Error serializando lista de colores", e);
        }
    }

    @Override
    public List<PorcentajeColor> convertToEntityAttribute(String json) {
        try {
            if (json == null || json.isBlank()) return List.of();
            return mapper.readValue(json, new TypeReference<List<PorcentajeColor>>() {});
        } catch (Exception e) {
            throw new IllegalArgumentException("Error deserializando lista de colores", e);
        }
    }
}
