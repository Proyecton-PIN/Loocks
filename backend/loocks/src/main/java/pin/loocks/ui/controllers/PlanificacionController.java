package pin.loocks.ui.controllers;

import java.time.LocalDate;
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

    @PostMapping("/create")
    public ResponseEntity<Planificacion> createPlan(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestBody Planificacion plan) {
        
        return ResponseEntity.ok(planificacionService.createPlan(plan, user.getId()));
    }

    @GetMapping("/range")
    public ResponseEntity<List<Planificacion>> getPlansRange(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestParam LocalDate start,
            @RequestParam LocalDate end) {
        
        return ResponseEntity.ok(planificacionService.getPlansForMonth(user.getId(), start, end));
    }

    @PostMapping("/add-outfit")
    public ResponseEntity<Void> addOutfitToPlan(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestBody Map<String, Object> payload) {
        
        Long planId = Long.valueOf(payload.get("planId").toString());
        Long outfitId = Long.valueOf(payload.get("outfitId").toString());
        LocalDate fecha = LocalDate.parse(payload.get("fecha").toString());

        planificacionService.addOutfitToPlan(planId, outfitId, fecha, user.getId());
        return ResponseEntity.ok().build();
    }
}