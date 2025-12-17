package pin.loocks.ui.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional; // <--- IMPORTANTE
import org.springframework.web.bind.annotation.*;
import pin.loocks.data.repositories.ItemMaletaRepository;
import pin.loocks.data.repositories.PlanificacionRepository;
import pin.loocks.domain.dtos.AddItemMaletaRequestDTO;
import pin.loocks.domain.models.Articulo;
import pin.loocks.domain.models.ItemMaleta;
import pin.loocks.domain.models.OutfitLog;
import pin.loocks.domain.models.Planificacion;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/maleta")
@CrossOrigin(origins = "*")
public class MaletaController {

    @Autowired
    private ItemMaletaRepository itemMaletaRepository;

    @Autowired
    private PlanificacionRepository planificacionRepository;

    // 1. OBTENER ITEMS
    @GetMapping("/{planId}")
    public ResponseEntity<List<ItemMaleta>> getItems(@PathVariable Long planId) {
        return ResponseEntity.ok(itemMaletaRepository.findByPlanificacionIdOrderByIdDesc(planId));
    }

    // 2. AÑADIR ITEM (MANUAL)
    @PostMapping("/add")
    public ResponseEntity<ItemMaleta> addItem(@RequestBody AddItemMaletaRequestDTO request) {
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

    // 3. GENERAR MALETA AUTOMÁTICA (IMPORTAR ROPA)
    @PostMapping("/generar/{planId}")
    @Transactional // <--- ESTO SOLUCIONA EL PROBLEMA DE LA CARGA DE DATOS
    public ResponseEntity<List<ItemMaleta>> generarMaletaDesdeOutfits(@PathVariable Long planId) {
        System.out.println("Iniciando generación de maleta para Plan ID: " + planId);

        Planificacion plan = planificacionRepository.findById(planId)
                .orElseThrow(() -> new RuntimeException("Plan no encontrado"));

        // Obtenemos lo que ya hay para no duplicar
        List<ItemMaleta> itemsExistentes = itemMaletaRepository.findByPlanificacionIdOrderByIdDesc(planId);
        Set<String> nombresExistentes = itemsExistentes.stream()
                .map(ItemMaleta::getNombre)
                .collect(Collectors.toSet());

        Set<String> prendasNecesarias = new HashSet<>();
        
        // Sacamos la ropa de los outfits con protección contra nulos
        if (plan.getOutfitLogs() != null && !plan.getOutfitLogs().isEmpty()) {
            System.out.println("Encontrados " + plan.getOutfitLogs().size() + " outfits en el plan.");
            
            for (OutfitLog log : plan.getOutfitLogs()) {
                if (log.getOutfit() != null && log.getOutfit().getArticulos() != null) {
                    for (Articulo articulo : log.getOutfit().getArticulos()) {
                        System.out.println(" - Prenda encontrada: " + articulo.getNombre());
                        prendasNecesarias.add(articulo.getNombre());
                    }
                }
            }
        } else {
            System.out.println("El plan no tiene outfits asignados.");
        }

        // Guardamos solo las nuevas
        int contadorNuevas = 0;
        for (String nombrePrenda : prendasNecesarias) {
            if (nombrePrenda != null && !nombresExistentes.contains(nombrePrenda)) {
                ItemMaleta nuevoItem = new ItemMaleta();
                nuevoItem.setNombre(nombrePrenda);
                nuevoItem.setCompletado(false);
                nuevoItem.setPlanificacion(plan);
                itemMaletaRepository.save(nuevoItem);
                contadorNuevas++;
            }
        }
        
        System.out.println("Se han añadido " + contadorNuevas + " prendas nuevas a la maleta.");

        return ResponseEntity.ok(itemMaletaRepository.findByPlanificacionIdOrderByIdDesc(planId));
    }

    // 4. MARCAR COMO COMPLETADO/PENDIENTE
    @PostMapping("/toggle/{itemId}")
    public ResponseEntity<ItemMaleta> toggleItem(@PathVariable Long itemId) {
        ItemMaleta item = itemMaletaRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item no encontrado"));
        
        item.setCompletado(!item.isCompletado());
        return ResponseEntity.ok(itemMaletaRepository.save(item));
    }

    // 5. BORRAR ITEM
    @DeleteMapping("/{itemId}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long itemId) {
        itemMaletaRepository.deleteById(itemId);
        return ResponseEntity.ok().build();
    }
}