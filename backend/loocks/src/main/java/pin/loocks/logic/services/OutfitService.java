package pin.loocks.logic.services;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import pin.loocks.data.repositories.OutfitLogRepository;
import pin.loocks.data.repositories.OutfitRepository;
import pin.loocks.domain.dtos.CreateOutfitRequestDTO;
import pin.loocks.domain.dtos.FilterRequestDTO;
import pin.loocks.domain.dtos.GenerateOutfitSuggestionsRequestDTO;
import pin.loocks.domain.enums.Zona;
import pin.loocks.domain.models.Articulo;
import pin.loocks.domain.models.Outfit;
import pin.loocks.domain.models.OutfitLog;
import pin.loocks.domain.models.Perfil;
import pin.loocks.logic.helpers.ColorHelper;

@Service
public class OutfitService {
  @Autowired
  private OutfitRepository outfitRepository;

  @Autowired
  private OutfitLogRepository outfitLogRepository;

  @Autowired
  private ArticuloService articuloService;

  public List<Outfit> getFilteredOutfits(FilterRequestDTO filter, Perfil perfil) {
    Pageable pageable = PageRequest.of(filter.getOffset() / filter.getLimit(), filter.getLimit());
    Specification<Outfit> specs = getFilterSpecs(filter, perfil);

    Page<Outfit> result = outfitRepository.findAll(specs, pageable);

    return result.getContent();
  }

  public OutfitLog createOutfit(CreateOutfitRequestDTO request, Perfil perfil) {
    Outfit newOutfit = new Outfit(request, perfil);
    
    newOutfit.getArticulos().forEach(a -> {
      a.setUsos(a.getUsos() + 1);
      a.setFechaUltimoUso(LocalDate.now());
    });

    Outfit createdOutfit = outfitRepository.save(newOutfit);

    OutfitLog outfitLog = new OutfitLog(createdOutfit);
    return outfitLogRepository.save(outfitLog);
  }

  public List<OutfitLog> getOutfitLogs(Perfil perfil) {
    return outfitLogRepository.findAllByPerfilId(perfil.getId());
  }

  public List<Outfit> generateSuggestions(
      GenerateOutfitSuggestionsRequestDTO request,
      String userId) {

    FilterRequestDTO torsoFilter = new FilterRequestDTO(List.of(Zona.TORSO));
    torsoFilter.setPuedePonerseEncimaDeOtraPrenda(false);
    List<Articulo> torsos = articuloService.getFilteredArticulos(
        torsoFilter,
        userId);

    List<Articulo> piernas = articuloService
        .getFilteredArticulos(
            new FilterRequestDTO(List.of(Zona.PIERNAS)),
            userId)
        .stream()
        .filter(e -> e.getZonasCubiertas().size() == 1)
        .collect(Collectors.toList());

    List<Articulo> pies = articuloService.getFilteredArticulos(
        new FilterRequestDTO(List.of(Zona.PIES)),
        userId);

    List<Outfit> outfits = new ArrayList<>();

    for (Articulo torso : torsos) {
      if (torso.getZonasCubiertas().size() > 1) {
        Articulo bestPie = selectBestPies(torso, null, pies);
        if (bestPie != null) {
          outfits.add(new Outfit(torso, null, bestPie));
        }
        continue;
      }

      for (Articulo pierna : piernas) {
        double torsoPiernaColorScore = ColorHelper.calculateColorAffinity(
            torso,
            pierna,
            null);

        if (torsoPiernaColorScore < 0.5)
            continue;

          Articulo bestPie = selectBestPies(torso, pierna, pies);
          if (bestPie != null) {
            outfits.add(new Outfit(torso, pierna, bestPie));
        }
      }
    }

    // TODO: Añadir abrigo, si es necesario
    // TODO: Añadir extra suggestions

    if (outfits.isEmpty())
      return List.of();

    int limit = request.getLimit();
    if (outfits.size() < request.getLimit())
      limit = outfits.size();

    Collections.shuffle(outfits);
    return outfits.subList(0, limit);
  }


  private Specification<Outfit> getFilterSpecs(FilterRequestDTO filter, Perfil perfil) {
    return (Root<Outfit> root, CriteriaQuery<?> query, CriteriaBuilder cb) -> {
      Predicate p = cb.conjunction();

      p = cb.and(p, cb.equal(root.get("perfil"), perfil));

      if (filter.getEstilo() != null) {
        p = cb.and(p, cb.equal(root.get("estilo"), filter.getEstilo()));
      }

      if (filter.getEstacion() != null) {
        p = cb.and(p, cb.equal(root.get("estacion"), filter.getEstacion()));
      }

      if (filter.getIsFavorito() != null) {
        p = cb.and(p, cb.equal(root.get("isFavorito"), filter.getIsFavorito()));
      }

      return p;
    };
  }

  private Articulo selectBestPies(Articulo torso, Articulo piernas, List<Articulo> pies) {
    Articulo bestArticulo = null;
    double bestArticuloScore = 0;

    for (Articulo pie : pies) {
      double colorScore = ColorHelper.calculateColorAffinity(torso, piernas, pie);
      /**
       * TODO:
       * usosScore
       * isFavoritoScore
       * estiloScore
       * estacionScore
       * 
       * quitar request.getOutfitsBaneados()
       */

      if (colorScore > bestArticuloScore) {
        bestArticulo = pie;
        bestArticulo = pie;
      }
    }

    return bestArticulo;
  }

  // @Autowired
  // private OutfitRepository outfitRepository;

  // @Autowired
  // private ArticuloRepository articuloRepository;

  // @Autowired
  // private PerfilRepository perfilRepository;

  // @Transactional
  // public Outfit createOutfit(
  // String mood,
  // String satisfaccion,
  // boolean isFavorito,
  // String perfilId,
  // List<Long> articuloIds) {

  // if (articuloIds == null || articuloIds.isEmpty()) {
  // throw new IllegalArgumentException("Debe incluir al menos un artículo en el
  // outfit.");
  // }

  // Perfil perfil = perfilRepository.findById(perfilId)
  // .orElseThrow(() -> new IllegalArgumentException("Perfil no encontrado: " +
  // perfilId));

  // List<Articulo> articulos = new
  // ArrayList<>(articuloRepository.findAllById(articuloIds));

  // if (articulos.isEmpty()) {
  // throw new IllegalArgumentException("Los artículos especificados no
  // existen.");
  // }

  // Outfit outfit = new Outfit();
  // outfit.setPerfil(perfil);
  // outfit.setArticulos(articulos);
  // outfit.setMood(mood);
  // outfit.setSatisfaccion(satisfaccion);
  // outfit.setFavorito(isFavorito);

  // return outfitRepository.save(outfit);
  // }

  // /**
  // * Crea un Outfit a partir del DTO y delega al método existente.
  // */
  // @Transactional
  // public Outfit createOutfit(OutfitCreateDTO dto) {
  // String mood = dto.getMood() != null ? dto.getMood() : "Sin categoría";
  // String satisfaccion = dto.getSatisfaccion();
  // boolean isFavorito = dto.getIsFavorito() != null && dto.getIsFavorito();
  // String perfilId = dto.getPerfilId();
  // List<Long> articuloIds = dto.getArticulosIds() != null ?
  // dto.getArticulosIds() : List.of();

  // return createOutfit(mood, satisfaccion, isFavorito, perfilId, articuloIds);
  // }

  // public List<Outfit> getOutfitsByPerfil(String perfilId) {
  // return outfitRepository.findByPerfilId(perfilId);
  // }

  // public List<Outfit> getAllOutfits() {
  // return outfitRepository.findAll();
  // }
}
