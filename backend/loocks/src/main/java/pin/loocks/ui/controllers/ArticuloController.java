package pin.loocks.ui.controllers;

import java.net.URI;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import pin.loocks.data.repositories.ArticuloRepository;
import pin.loocks.domain.models.Articulo;
import pin.loocks.logic.services.ArticuloService;

@RestController
@RequestMapping("/api/articulos")
public class ArticuloController {

  @Autowired
  private ArticuloRepository articuloRepository;

  @Autowired
  private ArticuloService articuloService;

  @PostMapping
  public ResponseEntity<?> createArticulo(@RequestBody Articulo articulo) {
    // Basic validation for required fields
    if (articulo.getUserId() == null || articulo.getUserId().isBlank()) {
      return ResponseEntity.badRequest().build();
    }
    if (articulo.getImageUrl() == null || articulo.getImageUrl().isBlank()) {
      return ResponseEntity.badRequest().build();
    }

    try {
      Articulo nuevo = articuloRepository.save(articulo);
      System.out.println("Articulo guardado con id=" + nuevo.getId());

      URI location = ServletUriComponentsBuilder
        .fromCurrentRequest()
        .path("/{id}")
        .buildAndExpand(nuevo.getId())
        .toUri();

      return ResponseEntity.created(location).body(nuevo);
    } catch (Exception e) {
      System.err.println("Error al guardar el articulo: " + e.getMessage());
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

  
  @PostMapping("generateDetails")
  public String postMethodName(
    @AuthenticationPrincipal UserDetails userDetails,
    @RequestParam("file") MultipartFile img
  ) {
      
    return this.articuloService.generateDetails(img);
  }
}



