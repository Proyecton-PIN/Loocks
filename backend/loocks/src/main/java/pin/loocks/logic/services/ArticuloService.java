package pin.loocks.logic.services;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartFile;

import pin.loocks.logic.helpers.ImageHelper;

@Service
public class ArticuloService {
  public String generateDetails(MultipartFile img){
    MultipartFile imageWithouBackground = ImageHelper.removeBackground(img);
    ImageHelper.zip(imageWithouBackground);

    return null;
  }
}