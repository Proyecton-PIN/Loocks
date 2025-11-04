package pin.loocks.domain.dtos;

import java.util.List;

import lombok.Data;

@Data
public class LLMResponseDTO {
  private List<Candidate> candidates;

  @Data
  public class Candidate {
    private Content content;
    private String role;
  }

  @Data
  public class Content {
    private List<Part> parts;
  }

  @Data
  public class Part {
    private String text;
  }
}
