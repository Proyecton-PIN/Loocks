package pin.loocks.ui.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import pin.loocks.domain.dtos.FilterRequestDTO;
import pin.loocks.domain.dtos.GenerateOutfitSuggestionsRequestDTO;
import pin.loocks.domain.models.CustomUserDetails;
import pin.loocks.domain.models.Outfit;
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
    public ResponseEntity<Outfit> createOutfitEntity(@RequestBody String entity) {
        // TODO: process POST request
        return null;
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
