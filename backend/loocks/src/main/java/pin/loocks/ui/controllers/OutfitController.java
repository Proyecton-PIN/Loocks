package pin.loocks.ui.controllers;

import java.io.File;
import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import io.swagger.v3.oas.annotations.Parameter;
import pin.loocks.domain.dtos.CreateOutfitRequestDTO;
import pin.loocks.domain.dtos.FilterRequestDTO;
import pin.loocks.domain.dtos.GenerateOutfitSuggestionsRequestDTO;
import pin.loocks.domain.models.CustomUserDetails;
import pin.loocks.domain.models.Outfit;
import pin.loocks.domain.models.OutfitLog;
import pin.loocks.logic.services.OutfitService;


@RestController
@RequestMapping("/api/outfits")
@CrossOrigin(origins = "*")
public class OutfitController {

    @Autowired
    private OutfitService outfitService;

    @PostMapping("/filtered")
    public ResponseEntity<List<Outfit>> getFilteredOutfits(
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @RequestBody FilterRequestDTO request) {
      try {
        List<Outfit> outfits = outfitService.getFilteredOutfits(request, userDetails.getPerfil());
        return ResponseEntity.ok().body(outfits);
      } catch (Exception e) {
        System.out.println(e.getMessage());
        return ResponseEntity.internalServerError().build();
      }
    }

    @PostMapping("create")
    public ResponseEntity<OutfitLog> createOutfitEntity(
        @AuthenticationPrincipal CustomUserDetails user,
        @RequestBody CreateOutfitRequestDTO request) {
      try {
        OutfitLog newOutfit = outfitService.createOutfit(request, user.getPerfil());
        return ResponseEntity.ok().body(newOutfit);
      } catch (Exception e) {
        System.out.println(e.getMessage());
        return ResponseEntity.internalServerError().build();
      }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOutfit(@PathVariable Long id, @AuthenticationPrincipal CustomUserDetails user) {
      try {
        outfitService.deleteOutfitById(id, user.getPerfil());
        return ResponseEntity.noContent().build();
      } catch (Exception e) {
        System.out.println(e.getMessage());
        return ResponseEntity.internalServerError().build();
      }
    }

    @PostMapping("generateSuggestions")
    public ResponseEntity<List<Outfit>> generateSuggestions(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody GenerateOutfitSuggestionsRequestDTO request) {
        try {
            List<Outfit> outfits = outfitService.generateSuggestions(request, userDetails.getId());
            return ResponseEntity.ok().body(outfits);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping(value = "tryOnAvatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> postMethodName(
        @AuthenticationPrincipal CustomUserDetails user,
        @Parameter(description = "Image file", required = true) @RequestParam("data") List<Long> articuloIds,
        @Parameter(description = "Image file", required = true) @RequestParam("file") MultipartFile img)
        throws IOException {
      File tempFile = File.createTempFile("upload-", img.getOriginalFilename());
      img.transferTo(tempFile);

      if (img.isEmpty())
        return ResponseEntity.badRequest().build();

      try {
        String base64Image = outfitService.tryOnAvatar(user.getPerfil(), tempFile, articuloIds);
        return ResponseEntity.ok().body(base64Image);
      } catch (Exception e) {
        System.out.println(e.getMessage());
        return ResponseEntity.internalServerError().build();
      } finally {
        tempFile.delete();
      }
    }

    @GetMapping("logs")
    public ResponseEntity<List<OutfitLog>> getOutfitLogs(
        @AuthenticationPrincipal CustomUserDetails user) {
      try {
        List<OutfitLog> logs = outfitService.getOutfitLogs(user.getPerfil());
        return ResponseEntity.ok().body(logs);
      } catch (Exception e) {
        System.out.println(e.getMessage());
        return ResponseEntity.internalServerError().build();
      }
    }

    // @Autowired
    // private OutfitService outfitService;

    // /**
    // * Crea un outfit usando el DTO `OutfitCreateDTO`.
    // * La información mínima debe incluir mood y articulosIds; el DTO puede
    // incluir
    // * perfilId, satisfaccion e isFavorito si se desea especificar.
    // */
    // @PostMapping
    // public ResponseEntity<Outfit> createOutfit(@RequestBody OutfitCreateDTO dto)
    // {
    // // Normalizar valores por defecto
    // String mood = dto.getMood() != null ? dto.getMood() : "Sin categoría";
    // String satisfaccion = dto.getSatisfaccion();
    // boolean isFavorito = dto.getIsFavorito() != null && dto.getIsFavorito();
    // String perfilId = dto.getPerfilId();

    // List<Long> articuloIds = dto.getArticulosIds() != null ?
    // dto.getArticulosIds() : List.of();

    // Outfit created = outfitService.createOutfit(dto);

    // URI location = ServletUriComponentsBuilder.fromCurrentRequest()
    // .path("/{id}")
    // .buildAndExpand(created.getId())
    // .toUri();

    // return ResponseEntity.created(location).body(created);
    // }

    // @GetMapping
    // public ResponseEntity<List<Outfit>> listOutfits(@RequestParam(required =
    // false) String perfilId) {
    // if (perfilId != null) {
    // return ResponseEntity.ok(outfitService.getOutfitsByPerfil(perfilId));
    // }
    // return ResponseEntity.ok(outfitService.getAllOutfits());
    // }
}
