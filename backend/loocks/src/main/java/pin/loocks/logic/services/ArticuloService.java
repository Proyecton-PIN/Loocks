package pin.loocks.logic.services;

import java.io.File;

import org.springframework.stereotype.Service;

import pin.loocks.logic.helpers.ImageHelper;

@Service
public class ArticuloService {
  public void generateDetails(File img){
    File image = ImageHelper.removeBackground(img);
    ImageHelper.zip(image);
    
  }
}