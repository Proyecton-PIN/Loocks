package pin.loocks.ui.controllers;

import java.io.IOException;
import java.util.List;

import org.apache.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import pin.loocks.data.repositories.ArticuloRepository;
import pin.loocks.domain.dtos.ArticuloUploadRequestDTO;
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



