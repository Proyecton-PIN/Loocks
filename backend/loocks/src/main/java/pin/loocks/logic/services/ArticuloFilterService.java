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
import pin.loocks.data.repositories.ArticuloRepository;
import pin.loocks.domain.dtos.FilterRequestDTO;
import pin.loocks.domain.enums.Zona;
import pin.loocks.domain.models.Articulo;

@Service
public class ArticuloFilterService {

  @Autowired
  private ArticuloRepository articuloRepository;

  public List<Articulo> getFilteredArticulos(FilterRequestDTO filter, String userId) {
    Pageable pageable = PageRequest.of(filter.getOffset() / filter.getLimit(), filter.getLimit());
    Specification<Articulo> specs = getFilterSpecs(filter, userId);

    Page<Articulo> result = articuloRepository.findAll(specs, pageable);

    return result.getContent();
  }

  public List<Articulo> getArticulosByTipo(pin.loocks.domain.enums.TipoArticulo tipo, String userId) {
    if (tipo == null)
      return List.of();
    return articuloRepository.findByUserIdAndTipo(userId, tipo);
  }

  private Specification<Articulo> getFilterSpecs(FilterRequestDTO filter, String userId) {
    return (Root<Articulo> root, CriteriaQuery<?> query, CriteriaBuilder cb) -> {
      Predicate p = cb.conjunction();

      p = cb.and(p, cb.equal(root.get("userId"), userId));

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
        p = cb.and(p, cb.greaterThanOrEqualTo(root.get("nivelDeAbrigo"), filter.getNivelDeAbrigo()));
      }

      if (filter.getTipoToAvoid() != null) {
        p = cb.and(p, cb.notEqual(root.get("tipo"), filter.getTipoToAvoid()));
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
}
