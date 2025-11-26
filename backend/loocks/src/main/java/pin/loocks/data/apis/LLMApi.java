package pin.loocks.data.apis;

import java.io.File;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

import pin.loocks.domain.dtos.ChatGPTResponseDTO;
import pin.loocks.domain.dtos.ClothingAnalysisDTO;
import pin.loocks.domain.dtos.GeminiResponseDTO;
import pin.loocks.domain.enums.Estacion;
import pin.loocks.domain.enums.Estilo;
import pin.loocks.domain.enums.TipoArticulo;
import pin.loocks.domain.enums.Zona;
import pin.loocks.logic.helpers.ImageHelper;
import pin.loocks.logic.helpers.StringHelper;

@Component
public class LLMApi {
  @Value("${gemini.api.key}")
  private String geminiApiKey;

  @Value("${chatgpt.api.key}")
  private String chatGPTApiKey;

  public ClothingAnalysisDTO generateDetails(File img) throws Exception{
    RestApi<GeminiResponseDTO> query = new RestApi<>(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
        GeminiResponseDTO.class);

    String base64Img = ImageHelper.convertToBase64(img);

    query
        .addHeader("x-goog-api-key", geminiApiKey)
        .setContentType(MediaType.APPLICATION_JSON)
        .addBodyParam("contents", List.of(
            Map.of("parts", List.of(
                Map.of(
                    "inline_data", Map.of(
                        "mime_type", "image/png",
                        "data", base64Img)),
                Map.of(
                    "text", buildGenerateDetailsPrompt())))));

    GeminiResponseDTO response = (GeminiResponseDTO) query.executeAndGetBody();

    String rawText = response.getText();
    String cleanJson = StringHelper.cleanMarkdown(rawText);

    ObjectMapper objectMapper = new ObjectMapper();
    objectMapper.configure(
        DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES,
        false);
    return objectMapper.readValue(cleanJson, ClothingAnalysisDTO.class);
  }

  public String tryOutfitOnAvatar(List<File> imgs) {
    RestApi<ChatGPTResponseDTO> query = new RestApi<>(
        "https://api.openai.com/v1/images/edits",
        ChatGPTResponseDTO.class);

    query
        .addHeader("Authorization", "Bearer " + chatGPTApiKey)
        .asMultipart()
        .addFormParam("model", "gpt-image-1")
        .addFormFiles("image[]", imgs)
        .addFormParam("prompt",
            "Generate an image with the person on the first image wearing the clothes of the rest of images.");

    ChatGPTResponseDTO response = (ChatGPTResponseDTO) query.executeAndGetBody();

    return response.getData().get(0).getB64_json();
  }

  private static String buildGenerateDetailsPrompt() {
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
    
    return String.format(basePrompt, estaciones, estilos, zonasCubiertas, tiposArticulo);
  }
}
