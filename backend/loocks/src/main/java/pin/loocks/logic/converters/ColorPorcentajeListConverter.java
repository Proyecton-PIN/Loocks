package pin.loocks.logic.converters;

import java.util.List;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import pin.loocks.domain.models.PorcentajeColor;

@Converter
public class ColorPorcentajeListConverter implements AttributeConverter<List<PorcentajeColor>, String> {

    private final ObjectMapper mapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(List<PorcentajeColor> list) {
        try {
            if (list == null || list.isEmpty()) {
                return "[]";
            }
            return mapper.writeValueAsString(list);
        } catch (Exception e) {
            throw new IllegalArgumentException("Error serializando lista de colores", e);
        }
    }

    @Override
    public List<PorcentajeColor> convertToEntityAttribute(String value) {
        try {
            if (value == null || value.isBlank()) {
                return List.of();
            }
            System.out.println(value);
            return mapper.readValue(value, new TypeReference<List<PorcentajeColor>>() {
            });
        } catch (Exception e) {
            throw new IllegalArgumentException("Error deserializando lista de colores", e);
        }
    }
}
