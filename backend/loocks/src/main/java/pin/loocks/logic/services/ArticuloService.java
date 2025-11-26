package pin.loocks.logic.services;

import java.io.File;
import java.io.IOException;
import java.util.Date;
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
import pin.loocks.data.apis.LLMApi;
import pin.loocks.data.repositories.ArticuloRepository;
import pin.loocks.domain.dtos.ArticuloDetailDTO;
import pin.loocks.domain.dtos.ArticuloUpdateDTO;
import pin.loocks.domain.dtos.ArticuloUploadRequestDTO;
import pin.loocks.domain.dtos.ClothingAnalysisDTO;
import pin.loocks.domain.dtos.FilterRequestDTO;
import pin.loocks.domain.enums.Zona;
import pin.loocks.domain.models.Armario;
import pin.loocks.domain.models.Articulo;
import pin.loocks.logic.helpers.ImageHelper;

@Service
public class ArticuloService {

  @Autowired
  private ArticuloRepository articuloRepository;
  // @Autowired
  // private TagSerice tagSerice;

  @Autowired
  private LLMApi llmApi;
  
  @Autowired
  private ImageHelper imageHelper;

  @Autowired
  private StorageService storageService;

  public ClothingAnalysisDTO generateDetails(File img) throws Exception{
    File imageWithouBackground = imageHelper.removeBackground(img);
    File compressedImage = ImageHelper.zip(imageWithouBackground);
  
    ClothingAnalysisDTO analysis;

    try {
      analysis = llmApi.generateDetails(compressedImage);
    } catch (Exception e) {
      analysis = llmApi.generateDetails(compressedImage);
    }

    analysis.setBase64Img(ImageHelper.convertToBase64(compressedImage));

    imageWithouBackground.delete();
    compressedImage.delete();

    return analysis;
  }

  public Articulo createArticulo(ArticuloUploadRequestDTO dto, String userId, Armario armario) throws IOException {
    Articulo newArticulo = new Articulo(dto);
    newArticulo.setArmario(armario);
    newArticulo.setUserId(userId);
    // newArticulo.setTags(tagSerice.getOrCreateTags(dto.getTags()));

    String imageUrl = storageService.uploadFile(ImageHelper.base64ToBytes(dto.getBase64Img()), "user-images/users",
        userId, String.valueOf(new Date().getTime()) + ".png");
    newArticulo.setImageUrl(imageUrl);

    return articuloRepository.save(newArticulo);
  }

  public List<Articulo> getFilteredArticulos(FilterRequestDTO filter, String userId) {
    Pageable pageable = PageRequest.of(filter.getOffset() / filter.getLimit(), filter.getLimit());
    Specification<Articulo> specs = getFilterSpecs(filter, userId);

    Page<Articulo> result = articuloRepository.findAll(specs, pageable);

    return result.getContent();
  }

    public List<Articulo> getArticulosByTipo(pin.loocks.domain.enums.TipoArticulo tipo, String userId) {
      if (tipo == null) return List.of();
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

  public void deleteArticuloById(Long id, String userId){
    Articulo articulo = articuloRepository.findById(id).orElseThrow(() -> new RuntimeException("El articulo no existe"));

    if(!articulo.getUserId().equals(userId)){
        throw new RuntimeException("No tienes permisos suficientes");
    }

    articuloRepository.delete(articulo);
  }

 public Articulo updateArticulo(Long id, ArticuloUpdateDTO updateData, String userId) {
    Articulo articulo = articuloRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Articulo no encontrado"));

    if (!articulo.getUserId().equals(userId)) {
        throw new RuntimeException("No tienes permiso para editar esto");
    }
    
    if (updateData.getNombre() != null) {
            articulo.setNombre(updateData.getNombre());
    }

    if (updateData.getMarca() != null) {
        articulo.setMarca(updateData.getMarca());
    }

    if (updateData.getColorPrimario() != null) {
        articulo.setColorPrimario(updateData.getColorPrimario());
    }
      
    return articuloRepository.save(articulo);
  }

 public ArticuloDetailDTO getArticuloDetails(Long id, String userId) {
    Articulo articulo = articuloRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Articulo no encontrado"));

    if (!articulo.getUserId().equals(userId)) {
        throw new RuntimeException("No tienes permiso para ver esta prenda");
    }
    return new ArticuloDetailDTO(articulo);
  }


}