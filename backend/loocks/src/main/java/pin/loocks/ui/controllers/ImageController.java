package pin.loocks.ui.controllers;

import java.io.File;
import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import io.swagger.v3.oas.annotations.Parameter;
import pin.loocks.domain.dtos.ClothingAnalysisDTO;
import pin.loocks.data.repositories.ArticuloRepository;
import pin.loocks.data.repositories.PerfilRepository;
import pin.loocks.data.repositories.ArmarioRepository;
import pin.loocks.domain.models.Articulo;
import pin.loocks.domain.models.Perfil;
import pin.loocks.logic.helpers.ImageHelper;
import pin.loocks.data.apis.LLMApi;
import pin.loocks.domain.models.Armario;
import pin.loocks.domain.enums.TipoArticulo;
 
import pin.loocks.domain.models.CustomUserDetails;

import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URI;
import java.nio.file.Files;
import java.util.Map;
import java.util.Optional;
import java.util.List;
import java.util.stream.Collectors;
import net.coobird.thumbnailator.Thumbnails;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import java.io.FileOutputStream;
import java.util.Base64;


@RestController
@RequestMapping("/api/image")
public class ImageController {
  @Autowired
  private ArticuloRepository articuloRepository;

  @Autowired
  private ImageHelper imageHelper;

  @Autowired
  private LLMApi llmApi;

  @Autowired
  private PerfilRepository perfilRepository;

  @Autowired
  private ArmarioRepository armarioRepository;

  @Autowired
  private JdbcTemplate jdbcTemplate;

   private static final String SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlreWVtcmhheWZ0dHBweHZtYXF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NTY1NzAsImV4cCI6MjA3NjAzMjU3MH0.p4rJlMg8bH4jGyXwFLcIfn8i8got7U5e8-EqPewZk1U";
  private static final String SUPABASE_BASE = "https://ykyemrhayfttppxvmaqu.supabase.co/storage/v1/object/user-images";
  

  @PostMapping(value = "processPreview", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<?> processPreview(
    @AuthenticationPrincipal UserDetails userDetails,
    @Parameter(description = "Image file", required = true)
    @RequestParam("file") MultipartFile img
  ) throws IOException {
    File compressed = null;
    try {
      if (img.isEmpty()) return ResponseEntity.badRequest().body(Map.of("error", "empty file"));

      String original = img.getOriginalFilename();
      String suffix = (original != null && original.contains(".")) ? original.substring(original.lastIndexOf('.')) : ".tmp";
      File tmpUpload = File.createTempFile("upload-", suffix);
      img.transferTo(tmpUpload);
      try {
        compressed = pin.loocks.logic.helpers.ImageHelper.zip(tmpUpload);
      } finally {
        try { tmpUpload.delete(); } catch (Exception ignore) {}
      }

      File noBg = imageHelper.removeBackground(compressed);
      if (noBg == null) return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "background removal failed"));

      String outName = System.currentTimeMillis() + ".png";
      File pngFile = new File(noBg.getParent(), outName);
      Thumbnails.of(noBg).scale(1.0).outputFormat("png").toFile(pngFile);

      byte[] bytes = Files.readAllBytes(pngFile.toPath());
      String base64 = Base64.getEncoder().encodeToString(bytes);
      String dataUrl = "data:image/png;base64," + base64;

      ClothingAnalysisDTO details;
      try {
        details = llmApi.generateDetails(pngFile);
      } catch (Exception ex) {
        details = new ClothingAnalysisDTO();
      }

      return ResponseEntity.ok(Map.of("imageBase64", dataUrl, "details", details));

    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
    } finally {
      try { if (compressed != null) compressed.delete(); } catch (Exception ignore) {}
    }
  }

  @PostMapping(value = "saveProcessed", consumes = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<?> saveProcessed(
    @AuthenticationPrincipal CustomUserDetails userDetails,
    @org.springframework.web.bind.annotation.RequestBody Map<String, Object> body
  ) {
    try {
      if (body == null || body.get("imageBase64") == null || body.get("details") == null) return ResponseEntity.badRequest().body(Map.of("error", "missing image or details"));

      String base64 = body.get("imageBase64").toString();
      if (base64.startsWith("data:")) {
        base64 = base64.substring(base64.indexOf(",") + 1);
      }

      byte[] bytes = Base64.getDecoder().decode(base64);
      File tmp = File.createTempFile("processed-", ".png");
      try (FileOutputStream fos = new FileOutputStream(tmp)) { fos.write(bytes); }

      String userId = userDetails != null ? userDetails.getId() : "1";
      String fileName = System.currentTimeMillis() + ".png";
      String filePath = String.format("users/%s/%s", userId, fileName);
      String uploadUrl = SUPABASE_BASE + "/" + filePath;

      HttpRequest request = HttpRequest.newBuilder()
        .uri(URI.create(uploadUrl))
        .header("Authorization", "Bearer " + SUPABASE_KEY)
        .header("Content-Type", "image/png")
        .PUT(HttpRequest.BodyPublishers.ofByteArray(bytes))
        .build();

      HttpResponse<String> resp = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());
      if (resp.statusCode() >= 400) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "upload failed", "status", resp.statusCode()));
      }

      ObjectMapper mapper = new ObjectMapper();
      ClothingAnalysisDTO details = mapper.convertValue(body.get("details"), ClothingAnalysisDTO.class);

      // Robustly handle the "colors" field: it may come as null, a List<Map>, or already as List<PorcentajeColor>
      java.util.List<pin.loocks.domain.models.PorcentajeColor> safeColors = null;
      try {
        Object detailsRaw = body.get("details");
        if (detailsRaw instanceof java.util.Map dmap) {
          Object rawColors = dmap.get("colors");
          if (rawColors instanceof java.util.List) {
            safeColors = new java.util.ArrayList<>();
            for (Object item : (java.util.List<?>) rawColors) {
              if (item == null) continue;
              if (item instanceof pin.loocks.domain.models.PorcentajeColor pc) {
                safeColors.add(pc);
              } else {
                // try to convert map to PorcentajeColor
                try {
                  pin.loocks.domain.models.PorcentajeColor pc = mapper.convertValue(item, pin.loocks.domain.models.PorcentajeColor.class);
                  safeColors.add(pc);
                } catch (Exception ignore) {}
              }
            }
            if (safeColors.isEmpty()) safeColors = null;
          }
        }
      } catch (Exception ignore) { safeColors = null; }

      // If mapper already provided a typed list, prefer it when safeColors is null
      if (safeColors == null && details.getColors() != null && !details.getColors().isEmpty()) {
        safeColors = details.getColors();
      }

      TipoArticulo tipo = mapToTipoArticulo(details.getTags());

      Perfil perfil = perfilRepository.findById(userId).orElse(null);
      Armario armario = null;
      if (body.get("armarioId") != null) {
        try { armario = armarioRepository.findById(Long.valueOf(body.get("armarioId").toString())).orElse(null); } catch (Exception e) {}
      }
      if (armario == null) {
        if (perfil != null && perfil.getArmario() != null) {
          armario = perfil.getArmario();
        } else {
          Optional<Armario> any = armarioRepository.findAll().stream().findFirst();
          if (any.isPresent()) armario = any.get();
          else return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error","no armario available"));
        }
      }

      Articulo a = new Articulo();
      a.setUserId(userId);
      a.setImageUrl(uploadUrl);
      a.setArmario(armario);

      if (safeColors != null && !safeColors.isEmpty()) {
        a.setColores(safeColors);
      }
      if (details.getEstacion() != null) {
        a.setEstacion(details.getEstacion());
      }

      a.setTipo(tipo != null ? tipo : TipoArticulo.TODOS);

      Articulo saved = articuloRepository.save(a);

      // Hotfix: if safeColors were provided, write them to the jsonb column using JdbcTemplate
      // This bypasses JPA binding issues with jsonb/PGobject in some runtime environments.
      if (safeColors != null && !safeColors.isEmpty()) {
        try {
          String colorsJson = new ObjectMapper().writeValueAsString(safeColors);
          // Use explicit cast to jsonb to ensure Postgres interprets the parameter correctly
          jdbcTemplate.update("UPDATE articulo SET colores = cast(? as jsonb) WHERE id = ?", colorsJson, saved.getId());
        } catch (Exception ex) {
          // Log but don't fail the whole request
          ex.printStackTrace();
        }
      }
      return ResponseEntity.ok(Map.of("imageUrl", uploadUrl, "details", details, "id", saved.getId(), "type", "articulo", "tipo", saved.getTipo().name().toLowerCase()));

    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
    }
  }
 
  @PostMapping(value = "processAndSave", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<?> processAndSave(
    @AuthenticationPrincipal CustomUserDetails userDetails,
    @Parameter(description = "Image file", required = true)
    @RequestParam("file") MultipartFile img
  ) throws IOException {
    try {
      ResponseEntity<?> previewResp = processPreview(userDetails, img);
      if (previewResp.getStatusCode().is2xxSuccessful()) {
        Object body = previewResp.getBody();
        if (body instanceof Map) {
          @SuppressWarnings("unchecked")
          Map<String, Object> map = (Map<String, Object>) body;
          Object imageBase64 = map.get("imageBase64");
          Object details = map.get("details");
          Map<String, Object> saveBody = Map.of("imageBase64", imageBase64, "details", details);
          return saveProcessed(userDetails, saveBody);
        } else {
          return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "unexpected preview response"));
        }
      } else {
        return previewResp;
      }
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
    }
  }

  private TipoArticulo mapToTipoArticulo(List<String> tags) {
    if (tags == null) return TipoArticulo.TODOS;
    List<String> lower = tags.stream().map(String::toLowerCase).collect(Collectors.toList());
    for (TipoArticulo t : TipoArticulo.values()) {
      String name = t.name().toLowerCase().replace('_', ' ');
      for (String tag : lower) if (tag.contains(name) || name.contains(tag)) return t;
    }
    return TipoArticulo.TODOS;
  }
  
}
