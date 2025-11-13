package pin.loocks.logic.helpers;

public class StringHelper {
  public static String cleanMarkdown(String value) {
    return value.replaceAll("```json\\s*", "")
      .replaceAll("```\\s*", "")
      .replace("\\n", "")
      .replace("\\\"", "\"")
      .trim();
  }
}
