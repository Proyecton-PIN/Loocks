package pin.loocks.logic.helpers;



import org.springframework.web.multipart.MultipartFile;

import net.coobird.thumbnailator.Thumbnails;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
public class ImageHelper {
  public static void removeBackground(MultipartFile img){

  }

  public static BufferedImage zip(File image){
    try {
        return Thumbnails.of(image)
            .scale(1.0)
            .outputQuality(0.7)
            .asBufferedImage();
    } catch (IOException e) {
        e.printStackTrace();
        return null;
    }
  }
}
