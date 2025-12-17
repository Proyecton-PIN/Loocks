package pin.loocks.ui.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pin.loocks.data.repositories.ItemMaletaRepository;
import pin.loocks.data.repositories.PlanificacionRepository;
import pin.loocks.domain.dtos.AddItemMaletaRequestDTO; // <--- Importa el DTO
import pin.loocks.domain.models.ItemMaleta;
import pin.loocks.domain.models.Planificacion;

import java.util.List;

@RestController
@RequestMapping("/api/maleta")
@CrossOrigin(origins = "*")
public class MaletaController {

    @Autowired
    private ItemMaletaRepository itemMaletaRepository;

    @Autowired
    private PlanificacionRepository planificacionRepository;

    @GetMapping("/{planId}")
    public ResponseEntity<List<ItemMaleta>> getItems(@PathVariable Long planId) {
        return ResponseEntity.ok(itemMaletaRepository.findByPlanificacionIdOrderByIdDesc(planId));
    }

    // --- AQUÍ ESTABA EL POSIBLE ERROR ---
    @PostMapping("/add")
    public ResponseEntity<ItemMaleta> addItem(@RequestBody AddItemMaletaRequestDTO request) { // Usamos DTO
        
        if (request.getPlanId() == null || request.getNombre() == null) {
            return ResponseEntity.badRequest().build();
        }

        Planificacion plan = planificacionRepository.findById(request.getPlanId())
                .orElseThrow(() -> new RuntimeException("Plan no encontrado"));

        ItemMaleta item = new ItemMaleta();
        item.setNombre(request.getNombre());
        item.setCompletado(false);
        item.setPlanificacion(plan);

        return ResponseEntity.ok(itemMaletaRepository.save(item));
    }

    // ... (Mantén los métodos toggleItem, deleteItem y generarMaleta aquí) ...
    // Si necesitas que te los pase de nuevo dímelo.
}