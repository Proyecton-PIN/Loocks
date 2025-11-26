package pin.loocks.domain.dtos;

import java.util.List;

import lombok.Data;

@Data
public class ChatGPTResponseDTO {
  private Long created;
  private String background;
  private List<ChatGPTData> data;
  private String size;
  private String quality;

  @Data
  public static class ChatGPTData {
    private String b64_json;
  }

  @Data
  public static class ChatGPTUsage {
    private Integer total_tokens;
    private Integer input_tokens;
    private ChatGPTInputTokenDetails input_tokens_details;
  }

  @Data
  public static class ChatGPTInputTokenDetails {
    private Integer text_tokens;
    private Integer image_tokens;
  }
}
