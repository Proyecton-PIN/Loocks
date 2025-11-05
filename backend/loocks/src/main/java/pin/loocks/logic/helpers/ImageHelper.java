package pin.loocks.logic.helpers;

import java.io.File;
import java.io.IOException;

import net.coobird.thumbnailator.Thumbnails;
public class ImageHelper {
  public static File removeBackground(File img){
    return null;
  }

public static File zip(File image) {
    try {
      String fileName = image.getName();
      String extension = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
      
      String outputFormat = extension.equals("png") ? "jpg" : extension;
      double quality = extension.equals("png") ? 0.7 : 0.5;

      File output = new File(image.getParent(), fileName.replace("." + extension, "_compressed." + outputFormat));

      Thumbnails.of(image)
          .scale(1.0)
          .outputQuality(quality)
          .outputFormat(outputFormat)
          .toFile(output); 

      if (output.length() >= image.length()) {
          output.delete();
          return image;
      } 
      return output;
        
    } catch (IOException e) {
      e.printStackTrace();
      return null;
    }
}
}
