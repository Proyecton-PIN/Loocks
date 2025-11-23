package pin.loocks.data.apis;

import java.io.File;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

import pin.loocks.domain.dtos.ClothingAnalysisDTO;
import pin.loocks.domain.dtos.LLMResponseDTO;
import pin.loocks.domain.enums.Estacion;
import pin.loocks.domain.enums.Estilo;
import pin.loocks.domain.enums.TipoArticulo;
import pin.loocks.domain.enums.Zona;
import pin.loocks.logic.helpers.ImageHelper;
import pin.loocks.logic.helpers.StringHelper;

@Component
public class LLMApi {
  @Value("${llm.api.key}")
  private String apiKey;
  private final String baseUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
  private final RestTemplate restTemplate = new RestTemplate();

  public ClothingAnalysisDTO generateDetails(File img) throws Exception{
    String base64Img = ImageHelper.convertToBase64(img);

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    headers.set("x-goog-api-key", apiKey);

    String basePrompt = """
      Analyze the first item of clothing you see and provide the details in the next format:

      {
        \"nombre\": \"nombre\",
        \"marca\": \"marca\",
        \"colorPrimario\": \"#00ff00\",
        \"colores\": [
          {
            \"color\": \"#00ff00\",
            \"porcentaje\": 90
          },
          {
            \"color\": \"#49fcde\",
            \"porcentaje\": 10
          }
        ],
        \"estacion\": \"something\",
        \"estilo\": \"something\",
        \"zonasCubiertas\": [\"something1\",\"something2\"],
        \"nivelDeAbrigo\": 0.5,
        \"puedePonerseEncimaDeOtraPrenda\": false,
          \"tipo\": "TODOS",
      }

      If you don't know the value of any field, skip it.
      The field "estacion" must be one of the next values or the first if not known:
        %s
      The field \"estilo\" must be one of the next values or the last if not knwon:
        %s
      The field \"zonasCubiertas\" must be one of the next values or the last if not knwon:
        %s
      The field \"tipo\" must be one of the next values or the last if not known:
        %s

      The field \"nivelDeAbrigo\" must be between 0 and 1.ç

      The field \"puedePonerseEncimaDeOtraPrenda\" indicates if the clothing used to be on top of the others.

      If there isn't any clothing or you can't recognize any, return the next json:
      {}

      Remove any markdown anotations and any decoration, onle give me the details in json format.
      """;

    String estilos = Arrays.stream(Estilo.values())
        .map(Enum::name)
        .collect(Collectors.joining(", "));

    String zonasCubiertas = Arrays.stream(Zona.values())
      .map(Enum::name)
      .collect(Collectors.joining(", "));

    String estaciones = Arrays.stream(Estacion.values())
      .map(Enum::name)
      .collect(Collectors.joining(", "));

    String tiposArticulo = Arrays.stream(TipoArticulo.values())
        .map(Enum::name)
        .collect(Collectors.joining(", "));
    
    String prompt = String.format(basePrompt, estaciones, estilos, zonasCubiertas, tiposArticulo);

    MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
    body.add("contents", List.of(
      Map.of("parts", List.of(
        Map.of(
          "inline_data", Map.of(
            "mime_type", "image/jpeg",
            "data", base64Img
          )
        ),
        Map.of(
          "text", prompt
        )
      )))
    );

    HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
    ResponseEntity<LLMResponseDTO> response = restTemplate.postForEntity(
      baseUrl, 
      requestEntity, 
      LLMResponseDTO.class);

    String rawText = response.getBody().getText();
    String cleanJson = StringHelper.cleanMarkdown(rawText);

    ObjectMapper objectMapper = new ObjectMapper();
    objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    return objectMapper.readValue(cleanJson, ClothingAnalysisDTO.class);
  }
}
