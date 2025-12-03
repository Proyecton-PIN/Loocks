package pin.loocks.logic.services;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import pin.loocks.domain.dtos.FilterRequestDTO;
import pin.loocks.domain.dtos.GenerateOutfitSuggestionsRequestDTO;
import pin.loocks.domain.enums.Zona;
import pin.loocks.domain.models.Articulo;
import pin.loocks.domain.models.Outfit;
import pin.loocks.logic.helpers.ColorHelper;

@Service
public class OutfitSuggestionService {

  @Autowired
  private ArticuloFilterService articuloFilterService;

  public List<Outfit> generateSuggestions(
      GenerateOutfitSuggestionsRequestDTO request,
      String userId) {

    FilterRequestDTO torsoFilter = new FilterRequestDTO(List.of(Zona.TORSO));
    torsoFilter.setPuedePonerseEncimaDeOtraPrenda(false);
    List<Articulo> torsos = articuloFilterService.getFilteredArticulos(
        torsoFilter,
        userId);

    List<Articulo> piernas = articuloFilterService
        .getFilteredArticulos(
            new FilterRequestDTO(List.of(Zona.PIERNAS)),
            userId)
        .stream()
        .filter(e -> e.getZonasCubiertas().size() == 1)
        .collect(Collectors.toList());

    List<Articulo> pies = articuloFilterService.getFilteredArticulos(
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
}
