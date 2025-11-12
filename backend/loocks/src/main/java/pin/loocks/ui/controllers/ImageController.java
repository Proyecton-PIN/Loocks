package pin.loocks.ui.controllers;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
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
import pin.loocks.data.apis.LLMApi;
import pin.loocks.domain.dtos.ClothingAnalysisDTO;
import pin.loocks.logic.helpers.ImageHelper;
import pin.loocks.data.repositories.PrendaRepository;
import pin.loocks.data.repositories.AccesorioRepository;
import pin.loocks.data.repositories.PerfilRepository;
import pin.loocks.data.repositories.ArmarioRepository;
import pin.loocks.domain.models.Prenda;
import pin.loocks.domain.models.Accesorio;
import pin.loocks.domain.models.Perfil;
import pin.loocks.domain.models.Armario;
import pin.loocks.domain.enums.TipoPrenda;
import pin.loocks.domain.enums.TipoAccesorio;
import pin.loocks.domain.enums.Estacion;
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
import java.io.FileOutputStream;
import java.util.Base64;


@RestController
@RequestMapping("/api/image")
public class ImageController {
  @Autowired
  private LLMApi llmApi;

  @Autowired
  private ImageHelper imageHelper;

  @Autowired
  private PrendaRepository prendaRepository;

  @Autowired
  private AccesorioRepository accesorioRepository;

  @Autowired
  private PerfilRepository perfilRepository;

  @Autowired
  private ArmarioRepository armarioRepository;

  // Supabase settings (in-code for now as provided)
  private static final String SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlreWVtcmhheWZ0dHBweHZtYXF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NTY1NzAsImV4cCI6MjA3NjAzMjU3MH0.p4rJlMg8bH4jGyXwFLcIfn8i8got7U5e8-EqPewZk1U";
  private static final String SUPABASE_BASE = "https://ykyemrhayfttppxvmaqu.supabase.co/storage/v1/object/user-images";
  
  @PostMapping("removeBackground")
  public ResponseEntity<Resource> postMethodName(
    @AuthenticationPrincipal UserDetails userDetails, 
    @Parameter(description = "Image file", required = true)
    @RequestParam("file") MultipartFile img
  ) throws IOException {
    File tempFile = File.createTempFile("upload-", img.getOriginalFilename());
    img.transferTo(tempFile);

    try {
      if (img.isEmpty()) {
        return ResponseEntity.badRequest().build();
      }
      
      File result = imageHelper.removeBackground(tempFile);
      InputStreamResource resource = new InputStreamResource(new FileInputStream(result));
      
      return ResponseEntity.ok()
        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"compressed-" + img.getOriginalFilename() + "\"")
        .contentType(MediaType.APPLICATION_OCTET_STREAM)
        .contentLength(result.length())
        .body(resource);

    } catch (Exception e) {
      System.out.println(e);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    } finally {
      tempFile.delete();
    }
  }

  
  @PostMapping(value = "zipImage", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<Resource> zipImage(
    @AuthenticationPrincipal UserDetails userDetails, 
    @Parameter(description = "Image file", required = true)
    @RequestParam("file") MultipartFile img
  ) throws IOException {
    File tempFile = File.createTempFile("upload-", img.getOriginalFilename());
    img.transferTo(tempFile);

    try {
      if (img.isEmpty()) {
        return ResponseEntity.badRequest().build();
      }
        
      File result = ImageHelper.zip(tempFile);
      InputStreamResource resource = new InputStreamResource(new FileInputStream(result));
        

      return ResponseEntity.ok()
        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"compressed-" + img.getOriginalFilename() + "\"")
        .contentType(MediaType.APPLICATION_OCTET_STREAM)
        .contentLength(result.length())
        .body(resource);

    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    } finally {
      tempFile.delete();
    }
  }

  @PostMapping(value = "generateDetails", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<ClothingAnalysisDTO> generateDetails(
    @AuthenticationPrincipal UserDetails userDetails,
    @Parameter(description = "Image file", required = true)
    @RequestParam("file") MultipartFile img
  ) throws IOException {
    File tempFile = File.createTempFile("upload-", img.getOriginalFilename());
    img.transferTo(tempFile);

    try {
      if (img.isEmpty()) {
        return ResponseEntity.badRequest().build();
      }
        
      ClothingAnalysisDTO result = llmApi.generateDetails(tempFile);
      return ResponseEntity.ok(result);

    } catch (Exception e) {
      System.out.println(e.getMessage());
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    } finally {
      tempFile.delete();
    }
  }

  @PostMapping(value = "processPreview", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<?> processPreview(
    @AuthenticationPrincipal UserDetails userDetails,
    @Parameter(description = "Image file", required = true)
    @RequestParam("file") MultipartFile img
  ) throws IOException {
    File tempFile = File.createTempFile("upload-", img.getOriginalFilename());
    img.transferTo(tempFile);

    try {
      if (img.isEmpty()) return ResponseEntity.badRequest().body(Map.of("error", "empty file"));

    // compress
    File compressed = ImageHelper.zip(tempFile);

    // remove background from the compressed file
    File noBg = imageHelper.removeBackground(compressed);
      if (noBg == null) return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "background removal failed"));

      // ensure PNG
      String outName = System.currentTimeMillis() + ".png";
      File pngFile = new File(noBg.getParent(), outName);
      Thumbnails.of(noBg).scale(1.0).outputFormat("png").toFile(pngFile);

      // read bytes to base64
      byte[] bytes = Files.readAllBytes(pngFile.toPath());
      String base64 = Base64.getEncoder().encodeToString(bytes);
      String dataUrl = "data:image/png;base64," + base64;

      // analyze
      ClothingAnalysisDTO details = llmApi.generateDetails(pngFile);

      return ResponseEntity.ok(Map.of("imageBase64", dataUrl, "details", details));

    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
    } finally {
      tempFile.delete();
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

      // upload to supabase
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

      boolean isAccessory = determineAccessory(details);

      Perfil perfil = perfilRepository.findById(userId).orElse(null);
      Armario armario = null;
      if (body.get("armarioId") != null) {
        try { armario = armarioRepository.findById(Long.valueOf(body.get("armarioId").toString())).orElse(null); } catch (Exception e) {}
      }
      if (armario == null) {
        if (perfil != null && perfil.getArmarios() != null && !perfil.getArmarios().isEmpty()) {
          armario = perfil.getArmarios().get(0);
        } else {
          Optional<Armario> any = armarioRepository.findAll().stream().findFirst();
          if (any.isPresent()) armario = any.get();
          else return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error","no armario available"));
        }
      }

      final String DEFAULT_COLOR = "#000000";
      if (isAccessory) {
        Accesorio a = new Accesorio();
        a.setUserId(userId);
        a.setImageUrl(uploadUrl);
        a.setArmario(armario);
        if (details.getColors() != null && !details.getColors().isEmpty()) {
          a.setColorPrimario(details.getColors().get(0).getColor());
        } else {
          a.setColorPrimario(DEFAULT_COLOR);
        }
        if (details.getSeassons() != null && !details.getSeassons().isEmpty()) {
          try { a.setEstacion(Estacion.valueOf(details.getSeassons().get(0).toUpperCase())); } catch (Exception e) {}
        }
        a.setTipoAccesorio(mapToTipoAccesorio(details.getTags()));
        Accesorio saved = accesorioRepository.save(a);
        return ResponseEntity.ok(Map.of("imageUrl", uploadUrl, "details", details, "id", saved.getId(), "type", "accesorio"));
      } else {
        Prenda p = new Prenda();
        p.setUserId(userId);
        p.setImageUrl(uploadUrl);
        p.setArmario(armario);
        if (details.getColors() != null && !details.getColors().isEmpty()) {
          p.setColorPrimario(details.getColors().get(0).getColor());
        } else {
          p.setColorPrimario(DEFAULT_COLOR);
        }
        if (details.getSeassons() != null && !details.getSeassons().isEmpty()) {
          try { p.setEstacion(Estacion.valueOf(details.getSeassons().get(0).toUpperCase())); } catch (Exception e) {}
        }
        p.setTipoPrenda(mapToTipoPrenda(details.getTags()));
        Prenda saved = prendaRepository.save(p);
        return ResponseEntity.ok(Map.of("imageUrl", uploadUrl, "details", details, "id", saved.getId(), "type", "prenda"));
      }

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
    File tempFile = File.createTempFile("upload-", img.getOriginalFilename());
    img.transferTo(tempFile);

    try {
      if (img.isEmpty()) return ResponseEntity.badRequest().body(Map.of("error", "empty file"));
      File compressed = ImageHelper.zip(tempFile);

      File noBg = imageHelper.removeBackground(compressed);

      if (noBg == null) return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "background removal failed"));

 
      String outName = System.currentTimeMillis() + ".png";
      File pngFile = new File(noBg.getParent(), outName);
      Thumbnails.of(noBg).scale(1.0).outputFormat("png").toFile(pngFile);

      String userId = userDetails != null ? userDetails.getId() : "1";
      String filePath = String.format("users/%s/%s", userId, outName);
      String uploadUrl = SUPABASE_BASE + "/" + filePath;

      byte[] bytes = Files.readAllBytes(pngFile.toPath());

      HttpRequest request = HttpRequest.newBuilder()
        .uri(URI.create(uploadUrl))
        .header("Authorization", "Bearer " + SUPABASE_KEY)
        .header("Content-Type", "image/png")
        .PUT(HttpRequest.BodyPublishers.ofByteArray(bytes))
        .build();

      HttpClient client = HttpClient.newHttpClient();
      HttpResponse<String> resp = client.send(request, HttpResponse.BodyHandlers.ofString());
      if (resp.statusCode() >= 400) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "upload failed", "status", resp.statusCode(), "body", resp.body()));
      }

      ClothingAnalysisDTO details = llmApi.generateDetails(pngFile);

      boolean isAccessory = determineAccessory(details);

      Perfil perfil = perfilRepository.findById(userId).orElse(null);
      Armario armario = null;
      if (perfil != null && perfil.getArmarios() != null && !perfil.getArmarios().isEmpty()) {
        armario = perfil.getArmarios().get(0);
      } else {
        armario = new Armario();
        try {
          java.lang.reflect.Field fName = Armario.class.getDeclaredField("nombre");
          fName.setAccessible(true);
          fName.set(armario, "Default");
          if (perfil != null) {
            java.lang.reflect.Field fPerfil = Armario.class.getDeclaredField("perfil");
            fPerfil.setAccessible(true);
            fPerfil.set(armario, perfil);
          } else {
            // no perfil found; try to use an existing armario from DB
            Optional<Armario> any = armarioRepository.findAll().stream().findFirst();
            if (any.isPresent()) {
              armario = any.get();
            } else {
              return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "No perfil or armario available to attach the artifact"));
            }
          }
        } catch (Exception e) {
          // ignore reflection errors
        }
        armario = armarioRepository.save(armario);
      }

      final String DEFAULT_COLOR = "#000000";
      if (isAccessory) {
        Accesorio a = new Accesorio();
        a.setUserId(userId);
        a.setImageUrl(uploadUrl);
        a.setArmario(armario);
        if (details.getColors() != null && !details.getColors().isEmpty()) {
          a.setColorPrimario(details.getColors().get(0).getColor());
        } else {
          a.setColorPrimario(DEFAULT_COLOR);
        }
        if (details.getSeassons() != null && !details.getSeassons().isEmpty()) {
          try { a.setEstacion(Estacion.valueOf(details.getSeassons().get(0).toUpperCase())); } catch (Exception e) {}
        }
        // map accessory type
        TipoAccesorio ta = mapToTipoAccesorio(details.getTags());
        a.setTipoAccesorio(ta);

        Accesorio saved = accesorioRepository.save(a);
        return ResponseEntity.ok(Map.of("imageUrl", uploadUrl, "details", details, "id", saved.getId(), "type", "accesorio"));
      } else {
        Prenda p = new Prenda();
        p.setUserId(userId);
        p.setImageUrl(uploadUrl);
        p.setArmario(armario);
        if (details.getColors() != null && !details.getColors().isEmpty()) {
          p.setColorPrimario(details.getColors().get(0).getColor());
        } else {
          p.setColorPrimario(DEFAULT_COLOR);
        }
        if (details.getSeassons() != null && !details.getSeassons().isEmpty()) {
          try { p.setEstacion(Estacion.valueOf(details.getSeassons().get(0).toUpperCase())); } catch (Exception e) {}
        }
        TipoPrenda tp = mapToTipoPrenda(details.getTags());
        p.setTipoPrenda(tp);

        Prenda saved = prendaRepository.save(p);
        return ResponseEntity.ok(Map.of("imageUrl", uploadUrl, "details", details, "id", saved.getId(), "type", "prenda"));
      }

    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
    } finally {
      tempFile.delete();
    }
  }

  private boolean determineAccessory(ClothingAnalysisDTO details) {
    if (details == null || details.getTags() == null) return false;
    List<String> tags = details.getTags().stream().map(String::toLowerCase).collect(Collectors.toList());
    for (TipoAccesorio a : TipoAccesorio.values()) {
      String name = a.name().toLowerCase().replace('_', ' ');
      if (tags.stream().anyMatch(t -> t.contains(name) || name.contains(t))) return true;
    }
    return false;
  }

  private TipoAccesorio mapToTipoAccesorio(List<String> tags) {
    if (tags == null) return TipoAccesorio.ANILLO;
    List<String> lower = tags.stream().map(String::toLowerCase).collect(Collectors.toList());
    for (TipoAccesorio a : TipoAccesorio.values()) {
      String name = a.name().toLowerCase().replace('_', ' ');
      for (String t : lower) if (t.contains(name) || name.contains(t)) return a;
    }
    return TipoAccesorio.ANILLO;
  }

  private TipoPrenda mapToTipoPrenda(List<String> tags) {
    if (tags == null) return TipoPrenda.CAMISETA;
    List<String> lower = tags.stream().map(String::toLowerCase).collect(Collectors.toList());
    for (TipoPrenda p : TipoPrenda.values()) {
      String name = p.name().toLowerCase().replace('_', ' ');
      for (String t : lower) if (t.contains(name) || name.contains(t)) return p;
    }
    return TipoPrenda.CAMISETA;
  }
 
  
}
