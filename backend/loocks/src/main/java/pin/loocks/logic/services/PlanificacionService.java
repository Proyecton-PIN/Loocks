package pin.loocks.logic.services;

import java.sql.Date;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import pin.loocks.data.repositories.OutfitRepository;
import pin.loocks.data.repositories.PerfilRepository;
import pin.loocks.data.repositories.PlanificacionRepository;
import pin.loocks.domain.dtos.GenerateOutfitSuggestionsRequestDTO;
import pin.loocks.domain.enums.Estilo;
import pin.loocks.domain.models.Outfit;
import pin.loocks.domain.models.OutfitLog;
import pin.loocks.domain.models.Perfil;
import pin.loocks.domain.models.Planificacion;

@Service
public class PlanificacionService {
    @Autowired
    private PlanificacionRepository planificacionRepository;

    @Autowired
    private PerfilRepository perfilRepository;

    @Autowired
    private OutfitRepository outfitRepository;

    @Autowired
    private OutfitSuggestionService outfitSuggestionService; 

    @Transactional
    public Planificacion createPlan(Planificacion plan, String userId) {
        Perfil perfil = perfilRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        plan.setPerfil(perfil);
        
        Planificacion savedPlan = planificacionRepository.save(plan);

       
        autoFillOutfits(savedPlan, userId);
        
        return savedPlan;
    }

    private void autoFillOutfits(Planificacion plan, String userId) {
        LocalDate start = plan.getFechaInicio();
        LocalDate end = plan.getFechaFin();
        
        long daysBetween = ChronoUnit.DAYS.between(start, end) + 1; 
        
        List<OutfitLog> logsGenerados = new ArrayList<>();

        for (int i = 0; i < daysBetween; i++) {
            LocalDate diaActual = start.plusDays(i);
            
            GenerateOutfitSuggestionsRequestDTO request = new GenerateOutfitSuggestionsRequestDTO();
            
            // TODO: Api para ver que temperatura hace

            request.setTemperatura(plan.getTemperaturaMedia() != null ? plan.getTemperaturaMedia() : 20.0); 
            request.setEstilo(Estilo.CASUAL); 
            request.setLimit(3); 

            List<Outfit> sugerencias = outfitSuggestionService.generateSuggestions(request, userId);

            if (!sugerencias.isEmpty()) {
                Outfit mejorOpcion = sugerencias.get(0);
            
                mejorOpcion.setPerfil(plan.getPerfil());
                mejorOpcion.setEstilo(request.getEstilo());
                Outfit outfitGuardado = outfitRepository.save(mejorOpcion);

                OutfitLog log = new OutfitLog();
                log.setPlanificacion(plan);
                log.setOutfit(outfitGuardado);
                log.setFechaInicio(diaActual);
                
                logsGenerados.add(log);
            }
        }

        plan.setOutfitLogs(logsGenerados);
        planificacionRepository.save(plan);
    }

    public List<Planificacion> getPlansForMonth(String userId, LocalDate start, LocalDate end) {
        return planificacionRepository.findByUserIdAndRange(userId, start, end);
    }

    public List<Planificacion> getAllPlans(String userId) {
        return planificacionRepository.findByPerfilId(userId);
    }

    public void addOutfitToPlan(Long planId, Long outfitId, LocalDate fechaUso, String userId) {
        Planificacion plan = planificacionRepository.findById(planId)
            .orElseThrow(() -> new RuntimeException("Plan no encontrado"));

        if (!plan.getPerfil().getId().equals(userId)) throw new RuntimeException("No tienes permiso");

        plan.getOutfitLogs().removeIf(log -> 
            log.getFechaInicio().equals(fechaUso));

        Outfit outfit = outfitRepository.findById(outfitId)
            .orElseThrow(() -> new RuntimeException("Outfit no encontrado"));

        OutfitLog log = new OutfitLog();
        log.setPlanificacion(plan);
        log.setOutfit(outfit);
        log.setFechaInicio(fechaUso);

        plan.getOutfitLogs().add(log);
        planificacionRepository.save(plan);
    }
}