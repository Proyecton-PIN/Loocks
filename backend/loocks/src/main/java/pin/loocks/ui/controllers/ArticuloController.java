package pin.loocks.ui.controllers;

import java.io.File;
import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
import pin.loocks.data.repositories.ArmarioRepository;
import pin.loocks.data.repositories.ArticuloRepository;
import pin.loocks.data.repositories.PrendaRepository;
import pin.loocks.data.repositories.AccesorioRepository;
import pin.loocks.data.repositories.TagsRepository;
import pin.loocks.domain.dtos.AccesorioUploadRequestDTO;
import pin.loocks.domain.dtos.PrendaUploadRequestDTO;
import pin.loocks.domain.dtos.ClothingAnalysisDTO;
import pin.loocks.domain.models.Accesorio;
import pin.loocks.domain.models.Articulo;
import pin.loocks.domain.models.CustomUserDetails;
import pin.loocks.domain.models.Prenda;
import pin.loocks.logic.services.ArticuloService;

@RestController
@RequestMapping("/api/articulos")
public class ArticuloController {

  @Autowired
  private ArticuloRepository articuloRepository;

  @Autowired
  private PrendaRepository prendaRepository;

  @Autowired
  private AccesorioRepository accesorioRepository;

  @Autowired
  private ArmarioRepository armarioRepsitory;

  @Autowired
  private TagsRepository tagsRepsitory;

  @Autowired
  private ArticuloService articuloService;

  @PostMapping("create/prenda")
  public ResponseEntity<?> createPrenda(
    @AuthenticationPrincipal CustomUserDetails userDetails,
    @RequestBody PrendaUploadRequestDTO dto
  ) {
    try {
      Prenda prendaFromDTO = dto.toPrenda();
      prendaFromDTO.setUserId(userDetails.getId());
      prendaFromDTO.setArmario(armarioRepsitory.getReferenceById(dto.getArmarioId()));
      if(dto.getTagsIds() != null) prendaFromDTO.setTags(tagsRepsitory.findAllById(dto.getTagsIds()));

  Prenda nuevo = prendaRepository.save(prendaFromDTO);
  System.out.println("Prenda guardada con id=" + nuevo.getId());

  return ResponseEntity.ok(nuevo.getId());
    } catch (Exception e) {
      System.err.println("Error al guardar la prenda: " + e.getMessage());
      e.printStackTrace();
      return ResponseEntity.status(500).body(java.util.Map.of("error", e.getMessage()));
    }
  }

   @PostMapping("create/accesorio")
  public ResponseEntity<?> createAccesorio(
    @AuthenticationPrincipal CustomUserDetails userDetails,
    @RequestBody AccesorioUploadRequestDTO dto
  ) {
    try {
      Accesorio accesorioFromDTO = dto.toAccesorio();
      accesorioFromDTO.setUserId(userDetails.getId());
      accesorioFromDTO.setArmario(armarioRepsitory.getReferenceById(dto.getArmarioId()));
      if(dto.getTagsIds() != null) accesorioFromDTO.setTags(tagsRepsitory.findAllById(dto.getTagsIds()));

  Accesorio nuevo = accesorioRepository.save(accesorioFromDTO);
  System.out.println("Accesorio guardado con id=" + nuevo.getId());

  return ResponseEntity.ok(nuevo.getId());
    } catch (Exception e) {
      System.err.println("Error al guardar el accesorio: " + e.getMessage());
      e.printStackTrace();
      return ResponseEntity.status(500).body(java.util.Map.of("error", e.getMessage()));
    }
  }

  

  @GetMapping("/{id}")
  public ResponseEntity<Articulo> getArticuloById(@PathVariable Long id) {
    return articuloRepository.findById(id)
      .map(ResponseEntity::ok)
      .orElseGet(() -> ResponseEntity.notFound().build());
  }

  @GetMapping
  public ResponseEntity<List<Articulo>> getArticulosByUser(@RequestParam(required = false) String userId) {
    if (userId == null) {
      return ResponseEntity.ok(articuloRepository.findAll());
    }
    return ResponseEntity.ok(articuloRepository.findByUserId(userId));
  }

  
  @PostMapping(value = "generateDetails", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<ClothingAnalysisDTO> postMethodName(
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
        
      ClothingAnalysisDTO result = this.articuloService.generateDetails(tempFile);
      return ResponseEntity.ok(result);

    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    } finally {
      tempFile.delete();
    }
  }
}



