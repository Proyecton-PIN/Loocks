package pin.loocks.logic.services;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import pin.loocks.domain.dtos.FilterRequestDTO;
import pin.loocks.domain.dtos.GenerateOutfitSuggestionsRequestDTO;
import pin.loocks.domain.enums.Estacion;
import pin.loocks.domain.enums.TipoArticulo;
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

    List<Articulo> torsos = getFilteredTorsos(request, userId);
    List<Articulo> piernas = getFilteredPiernas(request, userId);
    List<Articulo> pies = getFilteredPies(request, userId);

    List<Outfit> outfits = new ArrayList<>(List.of());

    for (Articulo torso : torsos) {
      if (torso.getZonasCubiertas().containsAll(List.of(Zona.TORSO, Zona.PIERNAS))) {
        for (Articulo pie : pies) {
          processOutfit(outfits, torso, null, pie);
        }
        continue;
      }

      for (Articulo pierna : piernas) {
        if (pierna.getZonasCubiertas().containsAll(List.of(Zona.TORSO, Zona.PIERNAS)))
          continue;

        for (Articulo pie : pies) {
          processOutfit(outfits, torso, pierna, pie);
        }
      }
    }

    List<Articulo> abrigos = getAbrigos(userId);
    double nivelDeAbrigo = getNivelOfAbrigo(request.getTemperatura(), request.getEstacion());

    List<Outfit> finalResults = new ArrayList<>(List.of());
    for (Outfit o : outfits) {
      if (o.getNivelDeAbrigo(null) < nivelDeAbrigo) {
        Articulo abrigo = null;

        for (Articulo a : abrigos) {
          double colorScore = ColorHelper.getAfinidad(
              o.getArticulos().get(0).getColorPrimario(),
              a.getColorPrimario());

          if (colorScore > 0.4 && o.getNivelDeAbrigo(a) >= nivelDeAbrigo) {
            abrigo = a;
            break;
          }
        }

        if (abrigo == null) {
          continue;
        }

        o.addArticulo(abrigo);
      }
      finalResults.add(o);
    }

    Collections.shuffle(finalResults);
    Collections.shuffle(finalResults);

    int limit = request.getLimit() > finalResults.size()
        ? finalResults.size()
        : request.getLimit();

    if (!request.getCanRepeatTorso())
      return removeRepeated(finalResults, limit, torsos.size());

    return finalResults.subList(
        0, limit);
  }

  private List<Outfit> removeRepeated(List<Outfit> outfits, int limit, int cantTorsos) {
    List<Long> viewedTorsos = new ArrayList<>();
    List<Outfit> results = new ArrayList<>();

    for (Outfit o : outfits) {
      Long torsoId = o.getArticulos().get(0).getId();
      if (viewedTorsos.contains(torsoId)
          && !o.getArticulos().getLast().getPuedePonerseEncimaDeOtraPrenda())
        continue;

      results.add(o);
      viewedTorsos.add(torsoId);

      if (results.size() >= limit)
        break;

      if (viewedTorsos.size() >= cantTorsos)
        viewedTorsos.clear();
    }

    return results;
  }

  private void processOutfit(List<Outfit> outfits, Articulo torso, Articulo pierna, Articulo pie) {
    double colorScore = ColorHelper.calculateColorAffinity(torso, pierna, pie);
    double estiloScore = getEstiloScore(torso, pierna, pie);
    double score = colorScore * 0.6 + estiloScore * 0.4;

    if (score < 0.4)
      return;

    outfits.add(new Outfit(torso, pierna, pie));
  }

  private static final double[][] MATRIZ_COMPATIBILIDAD = {
      // CAS FOR DEP STR ELE
      /* CASUAL */ { 1.0, 0.5, 0.7, 0.8, 0.4 },
      /* FORMAL */ { 0.5, 1.0, 0.1, 0.1, 0.9 },
      /* DEPORTIVO */ { 0.7, 0.1, 1.0, 0.9, 0.1 },
      /* STREETWEAR */{ 0.8, 0.1, 0.9, 1.0, 0.2 },
      /* ELEGANTE */ { 0.4, 0.9, 0.1, 0.2, 1.0 }
  };

  private double getEstiloScore(Articulo torso, Articulo pierna, Articulo pie) {
    int totalPrendas = 2;
    Integer p = null;
    int t = torso.getEstilo().ordinal();
    int f = pie.getEstilo().ordinal();

    if (pierna != null) {
      totalPrendas++;
      p = pierna.getEstilo().ordinal();
    }

    double scoreTorsoPiernas = 0;
    double scorePiernasPies = 0;
    double scoreTorsoPies = 0;

    if (p != null) {
      scoreTorsoPiernas = MATRIZ_COMPATIBILIDAD[t][p];
      scorePiernasPies = MATRIZ_COMPATIBILIDAD[p][f];
    }

    scoreTorsoPies = MATRIZ_COMPATIBILIDAD[t][f];

    return (scoreTorsoPiernas + scorePiernasPies + scoreTorsoPies) / totalPrendas;
  }

  private List<Articulo> getAbrigos(String userId) {
    FilterRequestDTO filter = new FilterRequestDTO();
    filter.setPuedePonerseEncimaDeOtraPrenda(true);
    return articuloFilterService.getFilteredArticulos(filter, userId);
  }

  private List<Articulo> getFilteredTorsos(GenerateOutfitSuggestionsRequestDTO request, String userId) {
    if (request.getPrendaBase() != null && request.getPrendaBase().getZonasCubiertas().contains(Zona.TORSO))
      return List.of(request.getPrendaBase());

    FilterRequestDTO filter = new FilterRequestDTO();
    filter.setZonasCubiertas(List.of(Zona.TORSO));
    filter.setEstilo(request.getEstilo());
    filter.setEstacion(request.getEstacion());
    filter.setPrimaryColor(request.getPrimaryColor());
    filter.setPuedePonerseEncimaDeOtraPrenda(false);
    filter.setTipoToAvoid(TipoArticulo.ACCESORIOS);

    return articuloFilterService.getFilteredArticulos(filter, userId);
  }

  private List<Articulo> getFilteredPiernas(GenerateOutfitSuggestionsRequestDTO request, String userId) {
    if (request.getPrendaBase() != null && request.getPrendaBase().getZonasCubiertas().contains(Zona.PIERNAS))
      return List.of(request.getPrendaBase());

    FilterRequestDTO filter = new FilterRequestDTO();
    filter.setZonasCubiertas(List.of(Zona.PIERNAS));
    filter.setEstilo(request.getEstilo());
    filter.setEstacion(request.getEstacion());
    filter.setPuedePonerseEncimaDeOtraPrenda(false);
    filter.setTipoToAvoid(TipoArticulo.ACCESORIOS);

    return articuloFilterService.getFilteredArticulos(filter, userId);
  }

  private List<Articulo> getFilteredPies(GenerateOutfitSuggestionsRequestDTO request, String userId) {
    if (request.getPrendaBase() != null && request.getPrendaBase().getZonasCubiertas().contains(Zona.PIES))
      return List.of(request.getPrendaBase());

    FilterRequestDTO filter = new FilterRequestDTO();
    filter.setZonasCubiertas(List.of(Zona.PIES));
    filter.setEstilo(request.getEstilo());
    filter.setPuedePonerseEncimaDeOtraPrenda(false);
    filter.setTipoToAvoid(TipoArticulo.ACCESORIOS);

    return articuloFilterService.getFilteredArticulos(filter, userId);
  }

  private double getNivelOfAbrigo(Double temperatura, Estacion estacion) {
    if (temperatura == null)
      return 0;

    double nivelBase = 1.0 - ((temperatura + 10) * 0.025);
    double factorCorreccion = 0.0;

    if (estacion == null)
      return nivelBase;

    switch (estacion) {
      case VERANO:
        if (temperatura < 20)
          factorCorreccion = 0.1;
        break;
      case INVIERNO:
        if (temperatura > 10)
          factorCorreccion = -0.1;
        break;
      case PRIMAVERA:
      case OTONO:
      case ENTRETIEMPO:
        factorCorreccion = 0.0;
        break;
    }

    double nivelFinal = nivelBase + factorCorreccion;

    return Math.max(0.0, Math.min(1.0, nivelFinal));
  }
}
