package pin.loocks.logic.services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import pin.loocks.data.repositories.ArticuloRepository;
import pin.loocks.data.repositories.OutfitRepository;
import pin.loocks.data.repositories.PerfilRepository;
import pin.loocks.domain.dtos.OutfitCreateDTO;
import pin.loocks.domain.models.Articulo;
import pin.loocks.domain.models.Outfit;
import pin.loocks.domain.models.Perfil;

@Service
public class OutfitService {

  @Autowired
  private OutfitRepository outfitRepository;

  @Autowired
  private ArticuloRepository articuloRepository;

  @Autowired
  private PerfilRepository perfilRepository;

  @Transactional
  public Outfit createOutfit(
      String mood,
      String satisfaccion,
      boolean isFavorito,
      String perfilId,
      List<Long> articuloIds) {

    if (articuloIds == null || articuloIds.isEmpty()) {
      throw new IllegalArgumentException("Debe incluir al menos un artículo en el outfit.");
    }

    Perfil perfil = perfilRepository.findById(perfilId)
        .orElseThrow(() -> new IllegalArgumentException("Perfil no encontrado: " + perfilId));

    List<Articulo> articulos = new ArrayList<>(articuloRepository.findAllById(articuloIds));

    if (articulos.isEmpty()) {
      throw new IllegalArgumentException("Los artículos especificados no existen.");
    }

    Outfit outfit = new Outfit();
    outfit.setPerfil(perfil);
    outfit.setArticulos(articulos);
    outfit.setMood(mood);
    outfit.setSatisfaccion(satisfaccion);
    outfit.setFavorito(isFavorito);

    return outfitRepository.save(outfit);
  }

  /**
   * Crea un Outfit a partir del DTO y delega al método existente.
   */
  @Transactional
  public Outfit createOutfit(OutfitCreateDTO dto) {
    String mood = dto.getMood() != null ? dto.getMood() : "Sin categoría";
    String satisfaccion = dto.getSatisfaccion();
    boolean isFavorito = dto.getIsFavorito() != null && dto.getIsFavorito();
    String perfilId = dto.getPerfilId();
    List<Long> articuloIds = dto.getArticulosIds() != null ? dto.getArticulosIds() : List.of();

    return createOutfit(mood, satisfaccion, isFavorito, perfilId, articuloIds);
    }

    public List<Outfit> getOutfitsByPerfil(String perfilId) {
      return outfitRepository.findByPerfilId(perfilId);
    }

    public List<Outfit> getAllOutfits() {
      return outfitRepository.findAll();
    }
}
