package pin.loocks.ui.controllers;

import java.io.File;
import java.io.IOException;
import java.util.List;

import org.apache.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import io.swagger.v3.oas.annotations.Parameter;
import pin.loocks.data.repositories.ArticuloRepository;
import pin.loocks.domain.dtos.ArticuloUploadRequestDTO;
import pin.loocks.domain.dtos.ClothingAnalysisDTO;
import pin.loocks.domain.dtos.FilterRequestDTO;
import pin.loocks.domain.models.Articulo;
import pin.loocks.domain.models.CustomUserDetails;
import pin.loocks.logic.services.ArticuloService;

@RestController
@RequestMapping("/api/articulos")
public class ArticuloController {

  @Autowired
  private ArticuloRepository articuloRepository;

  @Autowired
  private ArticuloService articuloService;

  @PostMapping("create")
  public ResponseEntity<Articulo> createArticulo(
      @AuthenticationPrincipal CustomUserDetails user,
      @RequestBody ArticuloUploadRequestDTO dto) {

    try {
      Articulo newArticulo = articuloService.createArticulo(dto, user.getId(), user.getArmario());
      return ResponseEntity.ok().body(newArticulo);
    } catch (IOException e) {
      System.out.println(e);
      return ResponseEntity.status(HttpStatus.SC_INTERNAL_SERVER_ERROR).build();
    }
  }

  @PostMapping(value = "getDetails", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<ClothingAnalysisDTO> generateDetails(
      @AuthenticationPrincipal UserDetails userDetails,
      @Parameter(description = "Image file", required = true) @RequestParam("file") MultipartFile img)
      throws IOException {
    File tempFile = File.createTempFile("upload-", img.getOriginalFilename());
    img.transferTo(tempFile);

    if (img.isEmpty())
      return ResponseEntity.badRequest().build();

    try {
      ClothingAnalysisDTO result = articuloService.generateDetails(tempFile);
      return ResponseEntity.ok(result);

    } catch (Exception e) {
      System.out.println(e.getMessage());
      return ResponseEntity.status(HttpStatus.SC_INTERNAL_SERVER_ERROR).build();
    } finally {
      tempFile.delete();
    }
  }

  @GetMapping("/{id}")
  public ResponseEntity<Articulo> getArticuloById(@PathVariable Long id) {
    return articuloRepository.findById(id)
      .map(ResponseEntity::ok)
      .orElseGet(() -> ResponseEntity.notFound().build());
  }

  @PostMapping("/filtered")
  public ResponseEntity<List<Articulo>> getFiltereArticulos(@RequestBody FilterRequestDTO request) {
    try {
      List<Articulo> articulos = articuloService.getFilteredArticulos(request);
      return ResponseEntity.ok().body(articulos);
    } catch (Exception e) {
      System.out.println(e.getMessage());
      return ResponseEntity.internalServerError().build();
    }
  }

  @GetMapping
  public ResponseEntity<List<Articulo>> getArticulosByUser(@AuthenticationPrincipal CustomUserDetails userDetails) {
    return ResponseEntity.ok(articuloRepository.findByUserId(userDetails.getId()));
  }
}



