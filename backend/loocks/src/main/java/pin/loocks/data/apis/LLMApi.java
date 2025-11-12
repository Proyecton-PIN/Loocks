package pin.loocks.data.apis;

import java.io.File;
import java.nio.file.Files;
import java.util.Arrays;
import java.util.Base64;
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

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.DeserializationFeature;

import pin.loocks.domain.dtos.ClothingAnalysisDTO;
import pin.loocks.domain.dtos.LLMResponseDTO;
import pin.loocks.domain.enums.TipoPrenda;

@Component
public class LLMApi {
  @Value("${llm.api.key}")
  private String apiKey;
  private final String baseUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
  private final RestTemplate restTemplate = new RestTemplate();

  public ClothingAnalysisDTO generateDetails(File img) throws Exception{
    byte[] imgAsBytes = Files.readAllBytes(img.toPath());
    String base64Img = Base64.getEncoder().encodeToString(imgAsBytes);

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    headers.set("x-goog-api-key", apiKey);
    
    String basePrompt = """
      Analyze the provided image and return a single, valid JSON object (no markdown, no explanations) containing ALL characteristics an `Articulo` may have.

      The JSON must use the exact keys below. If you do not know a value, set its value to the string "no identificado".

      Required JSON keys (use these exact names):
      {
        "nombre": "...",
        "marca": "...",
        "primaryColor": "#RRGGBB",
        "coloresSecundarios": ["#RRGGBB", ...],
        "colors": [{"color":"#RRGGBB","percentage":NN}, ...],
        "tags": ["tag1","tag2"],
        "seassons": ["primavera","otoño"],
          "tipoArticulo": "PRENDA",
          "type": "CAMISETA",
        "fechaCompra": "YYYY-MM-DD" | "no identificado",
        "fechaUltimoUso": "YYYY-MM-DD" | "no identificado",
        "usos": "0" | "no identificado",
        "userId": "..." | "no identificado",
        "imageUrl": "..." | "no identificado",
        "tipo": "ARTICULO"  // one of ARTICULO, PRENDA, ACCESORIO
      }

      Definitions and rules:
      - "tipoArticulo": must be one of: ARTICULO, PRENDA, ACCESORIO.
      - "type": when tipoArticulo equals PRENDA, choose one of the following clothing types:
        %s
      - When tipoArticulo equals ACCESORIO, choose one of the following accessory types:
        %s
      - If uncertain you may set "tipoArticulo":"no identificado" and "type":"no identificado".
      - Colors must be hex strings like "#RRGGBB". Percentages must be integers.
      - Dates must follow YYYY-MM-DD or be the string "no identificado".
      - "usos" must be an integer represented as a string (or "no identificado").

      IMPORTANT: Return ONLY the JSON object. Do NOT add any surrounding text, code fences, or explanation. Ensure the JSON is syntactically valid.

      Example (your output should follow this structure):
      {
        "nombre": "Camiseta fiesta",
        "marca": "no identificado",
        "primaryColor": "#ffcc00",
        "coloresSecundarios": ["#ffffff"],
        "colors": [{"color":"#ffcc00","percentage":80},{"color":"#ffffff","percentage":20}],
        "tags": ["camiseta","fiesta"],
        "seassons": ["verano"],
          "tipoArticulo": "PRENDA",
        "type": "CAMISETA",
        "fechaCompra": "no identificado",
        "fechaUltimoUso": "no identificado",
        "usos": "0",
        "userId": "no identificado",
        "imageUrl": "no identificado",
        "tipo": "PRENDA"
      }
      """;

    String prendas = Arrays.stream(TipoPrenda.values())
      .map(Enum::name)
      .collect(Collectors.joining(", "));

    String articulos = Arrays.stream(TipoPrenda.values())
      .map(Enum::name)
      .collect(Collectors.joining(", "));

    String prompt = String.format(basePrompt, prendas, articulos);

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

    String rawText = response.getBody()
      .getCandidates()
      .get(0)
      .getContent()
      .getParts()
      .get(0)
      .getText();

    String cleanJson = rawText
      .replaceAll("```json\\s*", "")
      .replaceAll("```\\s*", "")
      .replace("\\n", "")
      .replace("\\\"", "\"")
      .trim();

    ObjectMapper objectMapper = new ObjectMapper();
    objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    return objectMapper.readValue(cleanJson, ClothingAnalysisDTO.class);
  }
}
