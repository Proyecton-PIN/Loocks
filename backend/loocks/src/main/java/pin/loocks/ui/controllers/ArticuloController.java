package pin.loocks.ui.controllers;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import pin.loocks.data.repositories.AccesorioRepository;
import pin.loocks.data.repositories.ArmarioRepository;
import pin.loocks.data.repositories.ArticuloRepository;
import pin.loocks.data.repositories.PrendaRepository;
import pin.loocks.data.repositories.TagsRepository;
import pin.loocks.domain.dtos.AccesorioUploadRequestDTO;
import pin.loocks.domain.dtos.ArticuloUpdateDTO;
import pin.loocks.domain.dtos.PrendaUploadRequestDTO;
import pin.loocks.domain.models.Accesorio;
import pin.loocks.domain.models.Articulo;
import pin.loocks.domain.models.CustomUserDetails;
import pin.loocks.domain.models.Prenda;
import pin.loocks.logic.services.StorageService;
import pin.loocks.domain.models.Tag;

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
  private StorageService storageService;

  @PostMapping(value = "create/prenda", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<Prenda> createPrenda(
    @AuthenticationPrincipal CustomUserDetails userDetails,
    @RequestParam("data") PrendaUploadRequestDTO dto,
    @RequestParam("file") MultipartFile img
  ) {
    try {
      String imageUrl = this.storageService.uploadFile(
        img, 
        "user-images/users", 
        String.format("%s/%s", userDetails.getId(), img.getName()));

      Prenda prendaFromDTO = dto.toPrenda();
      prendaFromDTO.setUserId(userDetails.getId());
      prendaFromDTO.setArmario(armarioRepsitory.getReferenceById(dto.getArmarioId()));
      prendaFromDTO.setImageUrl(imageUrl);
      if(dto.getTagsIds() != null) prendaFromDTO.setTags(tagsRepsitory.findAllById(dto.getTagsIds()));

      Prenda nuevo = prendaRepository.save(prendaFromDTO);
      System.out.println("Prenda guardada con id=" + nuevo.getId());

      return ResponseEntity.ok(nuevo);
    } catch (Exception e) {
      System.err.println("Error al guardar la prenda: " + e.getMessage());
      e.printStackTrace();
      return ResponseEntity.status(500).build();
    }
  }

  @PostMapping(value = "create/accesorio", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<Accesorio> createAccesorio(
    @AuthenticationPrincipal CustomUserDetails userDetails,
    @RequestParam("data") AccesorioUploadRequestDTO dto,
    @RequestParam("file") MultipartFile img
  ) {
    try {
      String imageUrl = this.storageService.uploadFile(
        img, 
        "user-images/users", 
        String.format("%s/%s", userDetails.getId(), img.getName()));

      Accesorio accesorioFromDTO = dto.toAccesorio();
      accesorioFromDTO.setUserId(userDetails.getId());
      accesorioFromDTO.setArmario(armarioRepsitory.getReferenceById(dto.getArmarioId()));
      accesorioFromDTO.setImageUrl(imageUrl);

      if(dto.getTagsIds() != null) accesorioFromDTO.setTags(tagsRepsitory.findAllById(dto.getTagsIds()));

      Accesorio nuevo = accesorioRepository.save(accesorioFromDTO);
      System.out.println("Accesorio guardado con id=" + nuevo.getId());

      return ResponseEntity.ok(nuevo);
    } catch (Exception e) {
      System.err.println("Error al guardar el accesorio: " + e.getMessage());
      e.printStackTrace();
      return ResponseEntity.status(500).build();
    }
  }

  

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

  @DeleteMapping("/{id}")
  public ResponseEntity<?> deleteArticulo(
    @PathVariable Long id,
    @AuthenticationPrincipal CustomUserDetails userDetails
  ) {
    return articuloRepository.findById(id).map(existing -> {
      // ownership check
      if (!Objects.equals(existing.getUserId(), userDetails.getId())) {
        return ResponseEntity.status(403).build();
      }

      // try to delete image from storage if present
      String imageUrl = existing.getImageUrl();
      if (imageUrl != null && imageUrl.contains("/storage/v1/object/")) {
        try {
          String marker = "/storage/v1/object/";
          int idx = imageUrl.indexOf(marker);
          String remainder = imageUrl.substring(idx + marker.length()); // bucket/path
          int slash = remainder.indexOf('/');
          if (slash > 0) {
            String bucket = remainder.substring(0, slash);
            String path = remainder.substring(slash + 1);
            storageService.deleteFile(bucket, path);
          }
        } catch (Exception e) {
          // log and continue with deletion
          System.err.println("Error deleting image from storage: " + e.getMessage());
        }
      }

      articuloRepository.delete(existing);
      return ResponseEntity.noContent().build();
    }).orElseGet(() -> ResponseEntity.notFound().build());
  }

  @PutMapping("/{id}")
  public ResponseEntity<?> updateArticulo(
    @PathVariable Long id,
    @AuthenticationPrincipal CustomUserDetails userDetails,
    @org.springframework.web.bind.annotation.RequestBody ArticuloUpdateDTO dto
  ) {
    return articuloRepository.findById(id).map(existing -> {
      // ownership check
      if (!Objects.equals(existing.getUserId(), userDetails.getId())) {
        return ResponseEntity.status(403).build();
      }

      if (dto.getNombre() != null) existing.setNombre(dto.getNombre());
      if (dto.getMarca() != null) existing.setMarca(dto.getMarca());
      if (dto.getColorPrimario() != null) existing.setColorPrimario(dto.getColorPrimario());
      if (dto.getColoresSecundarios() != null) existing.setColoresSecundarios(dto.getColoresSecundarios());
      if (dto.getEstacion() != null) {
        try {
          existing.setEstacion(pin.loocks.domain.enums.Estacion.valueOf(dto.getEstacion()));
        } catch (Exception e) {
          // ignore invalid value
        }
      }
      if (dto.getFechaUltimoUso() != null) {
        try {
          existing.setFechaUltimoUso(LocalDate.parse(dto.getFechaUltimoUso()));
        } catch (Exception e) {
          // ignore parse errors
        }
      }
      if (dto.getUsos() != null) existing.setUsos(dto.getUsos());
      if (dto.getImageUrl() != null) existing.setImageUrl(dto.getImageUrl());
      if (dto.getTipo() != null) existing.setTipo(dto.getTipo());

      if (dto.getArmarioId() != null) {
        existing.setArmario(armarioRepsitory.getReferenceById(dto.getArmarioId()));
      }

      if (dto.getTagsIds() != null) {
        List<Long> ids = dto.getTagsIds().stream().filter(Objects::nonNull).collect(Collectors.toList());
        existing.setTags(tagsRepsitory.findAllById(ids));
      }

      Articulo saved = articuloRepository.save(existing);
      return ResponseEntity.ok(saved);
    }).orElseGet(() -> ResponseEntity.notFound().build());
  }
}



