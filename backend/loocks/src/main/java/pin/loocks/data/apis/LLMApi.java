package pin.loocks.data.apis;

import java.io.File;
import java.nio.file.Files;
import java.util.Base64;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;

import pin.loocks.domain.dtos.ClothingAnalysisDTO;
import pin.loocks.domain.dtos.LLMResponseDTO;

public class LLMApi {
  @Value("${llmapi.key}")
  private static String apiKey;
  private static final String baseUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
  private static final RestTemplate restTemplate = new RestTemplate();

  public static ClothingAnalysisDTO generateDetails(File img) throws Exception{
    byte[] imgAsBytes = Files.readAllBytes(img.toPath());
    String base64Img = Base64.getEncoder().encodeToString(imgAsBytes);

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    headers.set("x-goog-api-key", apiKey);
    
    String prompt = """
      Analyze this image and give me the next data in the same format about the clothing:
      {
        colors: [
          {
            color: \"#ffffff\", 
            percentage: 55
          },
          {
            color: \"#f70fe8\", 
            percentage: 65
          }
        ],
        tags: [\"camiseta\", \"fiesta\"],
        seassons: [\"primavera\", \"otoño\"]
      }
      """;

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
    return objectMapper.readValue(cleanJson, ClothingAnalysisDTO.class);
}
}
