package pin.loocks.logic.converters;

import java.util.List;

import org.postgresql.util.PGobject;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import pin.loocks.domain.models.PorcentajeColor;

@Converter
public class ColorPorcentajeListConverter implements AttributeConverter<List<PorcentajeColor>, PGobject> {

    private final ObjectMapper mapper = new ObjectMapper();

    @Override
    public PGobject convertToDatabaseColumn(List<PorcentajeColor> list) {
        try {
            PGobject pgObject = new PGobject();
            pgObject.setType("jsonb");
            pgObject.setValue(mapper.writeValueAsString(list));
            return pgObject;
        } catch (Exception e) {
            throw new IllegalArgumentException("Error serializando lista de colores", e);
        }
    }

    @Override
    public List<PorcentajeColor> convertToEntityAttribute(PGobject pgObject) {
        try {
            if (pgObject == null || pgObject.getValue() == null || pgObject.getValue().isBlank())
                return List.of();
            return mapper.readValue(pgObject.getValue(), new TypeReference<List<PorcentajeColor>>() {
            });
        } catch (Exception e) {
            throw new IllegalArgumentException("Error deserializando lista de colores", e);
        }
    }
}
