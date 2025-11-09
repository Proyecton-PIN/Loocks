package pin.loocks.api.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import pin.loocks.domain.dtos.OutfitCreateDTO;
import pin.loocks.domain.models.Outfit;
import pin.loocks.logic.services.OutfitService;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/outfits")
@CrossOrigin(origins = "*")
public class OutfitController {

    @Autowired
    private OutfitService outfitService;

    /**
     * Crea un outfit usando el DTO `OutfitCreateDTO`.
     * La información mínima debe incluir mood y articulosIds; el DTO puede incluir
     * perfilId, satisfaccion e isFavorito si se desea especificar.
     */
    @PostMapping
    public ResponseEntity<Outfit> createOutfit(@RequestBody OutfitCreateDTO dto) {
        // Normalizar valores por defecto
        String mood = dto.getMood() != null ? dto.getMood() : "Sin categoría";
        String satisfaccion = dto.getSatisfaccion();
        boolean isFavorito = dto.getIsFavorito() != null && dto.getIsFavorito();
        String perfilId = dto.getPerfilId();

        List<Long> articuloIds = dto.getArticulosIds() != null ? dto.getArticulosIds() : List.of();

        Outfit created = outfitService.createOutfit(dto);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(created.getId())
                .toUri();

        return ResponseEntity.created(location).body(created);
    }

    @GetMapping
    public ResponseEntity<List<Outfit>> listOutfits(@RequestParam(required = false) String perfilId) {
        if (perfilId != null) {
            return ResponseEntity.ok(outfitService.getOutfitsByPerfil(perfilId));
        }
        return ResponseEntity.ok(outfitService.getAllOutfits());
    }
}
