package pin.loocks.ui.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pin.loocks.data.repositories.ArticuloRepository;
import pin.loocks.domain.models.Articulo;
import pin.loocks.domain.models.CustomUserDetails;

@RestController
@RequestMapping("/api/articulos")
public class ArticuloController {

  @Autowired
  private ArticuloRepository articuloRepository;

  // @PostMapping(value = "create/prenda", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  // public ResponseEntity<Prenda> createPrenda(
  //   @AuthenticationPrincipal CustomUserDetails userDetails,
  //   @RequestParam("data") PrendaUploadRequestDTO dto,
  //   @RequestParam("file") MultipartFile img
  // ) {
  //   try {
  //     String imageUrl = this.storageService.uploadFile(
  //       img, 
  //       "user-images/users", 
  //       String.format("%s/%s", userDetails.getId(), img.getName()));

  //     Prenda prendaFromDTO = dto.toPrenda();
  //     prendaFromDTO.setUserId(userDetails.getId());
  //     prendaFromDTO.setArmario(armarioRepsitory.getReferenceById(dto.getArmarioId()));
  //     prendaFromDTO.setImageUrl(imageUrl);
  //     if(dto.getTagsIds() != null) prendaFromDTO.setTags(tagsRepsitory.findAllById(dto.getTagsIds()));

  //     Prenda nuevo = prendaRepository.save(prendaFromDTO);
  //     System.out.println("Prenda guardada con id=" + nuevo.getId());

  //     return ResponseEntity.ok(nuevo);
  //   } catch (Exception e) {
  //     System.err.println("Error al guardar la prenda: " + e.getMessage());
  //     e.printStackTrace();
  //     return ResponseEntity.status(500).build();
  //   }
  // }

  // @PostMapping(value = "create/accesorio", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  // public ResponseEntity<Accesorio> createAccesorio(
  //   @AuthenticationPrincipal CustomUserDetails userDetails,
  //   @RequestParam("data") AccesorioUploadRequestDTO dto,
  //   @RequestParam("file") MultipartFile img
  // ) {
  //   try {
  //     String imageUrl = this.storageService.uploadFile(
  //       img, 
  //       "user-images/users", 
  //       String.format("%s/%s", userDetails.getId(), img.getName()));

  //     Accesorio accesorioFromDTO = dto.toAccesorio();
  //     accesorioFromDTO.setUserId(userDetails.getId());
  //     accesorioFromDTO.setArmario(armarioRepsitory.getReferenceById(dto.getArmarioId()));
  //     accesorioFromDTO.setImageUrl(imageUrl);

  //     if(dto.getTagsIds() != null) accesorioFromDTO.setTags(tagsRepsitory.findAllById(dto.getTagsIds()));

  //     Accesorio nuevo = accesorioRepository.save(accesorioFromDTO);
  //     System.out.println("Accesorio guardado con id=" + nuevo.getId());

  //     return ResponseEntity.ok(nuevo);
  //   } catch (Exception e) {
  //     System.err.println("Error al guardar el accesorio: " + e.getMessage());
  //     e.printStackTrace();
  //     return ResponseEntity.status(500).build();
  //   }
  // }

  @GetMapping("/{id}")
  public ResponseEntity<Articulo> getArticuloById(@PathVariable Long id) {
    return articuloRepository.findById(id)
      .map(ResponseEntity::ok)
      .orElseGet(() -> ResponseEntity.notFound().build());
  }

  @GetMapping
  public ResponseEntity<List<Articulo>> getArticulosByUser(@AuthenticationPrincipal CustomUserDetails userDetails) {
    return ResponseEntity.ok(articuloRepository.findByUserId(userDetails.getId()));
  }
}



