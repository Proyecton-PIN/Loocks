package pin.loocks.domain.dtos;

import java.util.List;

import lombok.Data;

@Data
public class GeminiResponseDTO {
  private List<Candidate> candidates;

  @Data
  public static class Candidate {
    private Content content;
    private String role;
  }

  @Data
  public static class Content {
    private List<Part> parts;
  }

  @Data
  public static class Part {
    private String text;
  }

  public String getText() {
    return getCandidates()
      .get(0)
      .getContent()
      .getParts()
      .get(0)
      .getText();
  }
}
