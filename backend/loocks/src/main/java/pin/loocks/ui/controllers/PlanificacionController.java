package pin.loocks.ui.controllers;

import java.sql.Date;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import pin.loocks.domain.models.CustomUserDetails;
import pin.loocks.domain.models.Planificacion;
import pin.loocks.logic.services.PlanificacionService;

@RestController
@RequestMapping("/api/planning")
public class PlanificacionController {

    @Autowired
    private PlanificacionService planificacionService;

    // Crear un evento o viaje
    @PostMapping("/create")
    public ResponseEntity<Planificacion> createPlan(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestBody Planificacion plan) {
        
        return ResponseEntity.ok(planificacionService.createPlan(plan, user.getId()));
    }

    // Obtener calendario (recibe ?start=2023-11-01&end=2023-11-30)
    @GetMapping("/range")
    public ResponseEntity<List<Planificacion>> getPlansRange(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestParam Date start,
            @RequestParam Date end) {
        
        return ResponseEntity.ok(planificacionService.getPlansForMonth(user.getId(), start, end));
    }

    // Añadir ropa a un plan
    // Espera un JSON: { "planId": 1, "outfitId": 55, "fecha": "2023-11-10" }
    @PostMapping("/add-outfit")
    public ResponseEntity<Void> addOutfitToPlan(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestBody Map<String, Object> payload) {
        
        Long planId = Long.valueOf(payload.get("planId").toString());
        Long outfitId = Long.valueOf(payload.get("outfitId").toString());
        Date fecha = Date.valueOf(payload.get("fecha").toString()); // Formato YYYY-MM-DD

        planificacionService.addOutfitToPlan(planId, outfitId, fecha, user.getId());
        return ResponseEntity.ok().build();
    }
}