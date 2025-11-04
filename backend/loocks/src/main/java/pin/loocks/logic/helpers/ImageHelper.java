package pin.loocks.logic.helpers;

import java.io.File;
import java.io.IOException;

import net.coobird.thumbnailator.Thumbnails;
public class ImageHelper {
  public static File removeBackground(File img){
    return null;
  }

  public static File zip(File image){
    try {
      File output = new File(image.getName());
      
      Thumbnails.of(image)
        .scale(1.0)
        .outputQuality(0.7)
        .toFile(output);

      return output;
    } catch (IOException e) {
        e.printStackTrace();
        return null;
    }
  }
}
