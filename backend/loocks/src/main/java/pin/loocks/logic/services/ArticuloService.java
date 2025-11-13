package pin.loocks.logic.services;

import java.io.File;
import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import pin.loocks.data.apis.LLMApi;
import pin.loocks.data.repositories.ArticuloRepository;
import pin.loocks.domain.dtos.ArticuloUploadRequestDTO;
import pin.loocks.domain.dtos.ClothingAnalysisDTO;
import pin.loocks.domain.models.Armario;
import pin.loocks.domain.models.Articulo;
import pin.loocks.logic.helpers.ImageHelper;

@Service
public class ArticuloService {

  @Autowired
  private ArticuloRepository articuloRepository;
  @Autowired
  private TagSerice tagSerice;

  @Autowired
  private LLMApi llmApi;
  
  @Autowired
  private ImageHelper imageHelper;

  @Autowired
  private StorageService storageService;

  public ClothingAnalysisDTO generateDetails(File img) throws Exception{
    File imageWithouBackground = imageHelper.removeBackground(img);
    File compressedImage = ImageHelper.zip(imageWithouBackground);
  
    ClothingAnalysisDTO analysis = llmApi.generateDetails(compressedImage);
    analysis.setBase64Img(ImageHelper.convertToBase64(compressedImage));

    return analysis;
  }

  public Articulo createArticulo(ArticuloUploadRequestDTO dto, String userId, Armario armario) throws IOException {
    Articulo newArticulo = new Articulo(dto);
    newArticulo.setArmario(armario);
    newArticulo.setUserId(userId);
    newArticulo.setTags(tagSerice.getOrCreateTags(dto.getTags()));

    String imageUrl = storageService.uploadFile(ImageHelper.bage64ToBytes(dto.getBase64Img()), "users", userId);
    newArticulo.setImageUrl(imageUrl);

    return articuloRepository.save(newArticulo);
  }
}