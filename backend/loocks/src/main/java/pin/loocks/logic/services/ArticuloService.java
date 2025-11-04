package pin.loocks.logic.services;

import java.io.File;

import org.springframework.stereotype.Service;

import pin.loocks.data.apis.LLMApi;
import pin.loocks.domain.dtos.ClothingAnalysisDTO;
import pin.loocks.logic.helpers.ImageHelper;

@Service
public class ArticuloService {
  public ClothingAnalysisDTO generateDetails(File img) throws Exception{
    File imageWithouBackground = ImageHelper.removeBackground(img);
    File compressedImage = ImageHelper.zip(imageWithouBackground);
  
    ClothingAnalysisDTO analysis = LLMApi.generateDetails(compressedImage);

    return analysis;

  }
}