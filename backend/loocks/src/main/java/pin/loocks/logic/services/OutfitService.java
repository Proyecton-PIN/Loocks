package pin.loocks.logic.services;

import java.io.File;
import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.commons.lang3.exception.UncheckedException;
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
import pin.loocks.data.apis.LLMApi;
import pin.loocks.data.repositories.ArticuloRepository;
import pin.loocks.data.repositories.OutfitLogRepository;
import pin.loocks.data.repositories.OutfitRepository;
import pin.loocks.domain.dtos.CreateOutfitRequestDTO;
import pin.loocks.domain.dtos.FilterRequestDTO;
import pin.loocks.domain.models.Articulo;
import pin.loocks.domain.models.Outfit;
import pin.loocks.domain.models.OutfitLog;
import pin.loocks.domain.models.Perfil;
import pin.loocks.logic.helpers.ImageHelper;

@Service
public class OutfitService {
  @Autowired
  private OutfitRepository outfitRepository;

  @Autowired
  private OutfitLogRepository outfitLogRepository;

  @Autowired
  private ArticuloRepository articuloRepository;

  @Autowired
  private LLMApi llmApi;

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

  public void deleteOutfitById(Long id, Perfil perfil) {
    Outfit outfit = outfitRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Outfit no encontrado"));

    if (!outfit.getPerfil().getId().equals(perfil.getId())) {
      throw new RuntimeException("No tienes permisos para eliminar este outfit");
    }

    outfitRepository.delete(outfit);
  }

  public String tryOnAvatar(Perfil perfil, File img, List<Long> articuloIds) throws IOException {
    List<File> articuloFiles = articuloRepository
        .findAllByIdsAndPerfilId(articuloIds, perfil.getId())
        .stream()
        .map(art -> {
          try {
            File tmp = File.createTempFile("upload-" + art.getNombre(), ".png");
            ImageHelper.downloadFileFromURL(art.getImageUrl(), tmp);

            return tmp;
          } catch (Exception e) {
            throw new UncheckedException(e);
          }
        })
        .collect(Collectors.toList());

    List<File> imgs = new ArrayList<>(List.of(img));
    imgs.addAll(articuloFiles);

    String result = llmApi.tryOutfitOnAvatar(imgs);

    imgs.forEach(i -> i.delete());

    return result;
  }

  /// -------------------------------------



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

  public Outfit updateOutfit(Long outfitId, List<Long> articulosIds) {
        Outfit outfit = outfitRepository.findById(outfitId)
            .orElseThrow(() -> new RuntimeException("Outfit no encontrado con id: " + outfitId));

        List<Articulo> nuevosArticulos = articuloRepository.findAllById(articulosIds);

        outfit.setArticulos(nuevosArticulos);
        return outfitRepository.save(outfit);
    }
}