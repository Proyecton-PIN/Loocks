package pin.loocks.logic.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import pin.loocks.data.repositories.OutfitRepository;
import pin.loocks.domain.dtos.FilterRequestDTO;
import pin.loocks.domain.dtos.GenerateOutfitSuggestionsRequestDTO;
import pin.loocks.domain.enums.Zona;
import pin.loocks.domain.models.Articulo;
import pin.loocks.domain.models.Outfit;

@Service
public class OutfitService {
  @Autowired
  private OutfitRepository outfitRepository;

  public List<Outfit> getFilteredOutfits(FilterRequestDTO filter) {
    Pageable pageable = PageRequest.of(filter.getOffset() / filter.getLimit(), filter.getLimit());
    Specification<Outfit> specs = getFilterSpecs(filter);

    Page<Outfit> result = outfitRepository.findAll(specs, pageable);

    return result.getContent();
  }

  public List<Outfit> generateSuggestions(GenerateOutfitSuggestionsRequestDTO request) {
    // TODO:
    return null;
  }

  public Outfit createOutfit() {
    // TODO:
    return null;
  }

  private Specification<Outfit> getFilterSpecs(FilterRequestDTO filter) {
    return (Root<Outfit> root, CriteriaQuery<?> query, CriteriaBuilder cb) -> {
      Predicate p = cb.conjunction();

      if (filter.getEstilo() != null) {
        p = cb.and(p, cb.equal(root.get("estilo"), filter.getEstilo()));
      }

      if (filter.getEstacion() != null) {
        p = cb.and(p, cb.equal(root.get("estacion"), filter.getEstacion()));
      }

      if (filter.getPrimaryColor() != null && !filter.getPrimaryColor().isBlank()) {
        p = cb.and(p, cb.equal(root.get("colorPrimario"), filter.getPrimaryColor()));
      }

      if (filter.getIsFavorito() != null) {
        p = cb.and(p, cb.equal(root.get("isFavorito"), filter.getIsFavorito()));
      }

      if (filter.getPuedePonerseEncimaDeOtraPrenda() != null) {
        p = cb.and(p, cb.equal(root.get("puedePonerseEncimaDeOtraPrenda"), filter.getPuedePonerseEncimaDeOtraPrenda()));
      }

      if (filter.getNivelDeAbrigo() != null) {
        // Ejemplo: filtro por nivelDeAbrig >= nivelDeAbrigo deseado
        p = cb.and(p, cb.greaterThanOrEqualTo(root.get("nivelDeAbrig"), filter.getNivelDeAbrigo()));
      }

      // Filtrar por zonasCubiertas (ManyToMany)
      List<Zona> zonas = filter.getZonasCubiertas();
      if (zonas != null && !zonas.isEmpty()) {
        // zonasCubiertas es una colección de enums -> join directo
        Join<Articulo, Zona> zonasJoin = root.join("zonasCubiertas");
        p = cb.and(p, zonasJoin.in(zonas));
        query.distinct(true); // evita duplicados por el join
      }

      return p;
    };
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
