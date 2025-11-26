package pin.loocks.logic.helpers;

import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Base64;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.cloudinary.Cloudinary;
import com.cloudinary.Transformation;
import com.cloudinary.utils.ObjectUtils;

import net.coobird.thumbnailator.Thumbnails;

@Component
public class ImageHelper {
  @Value("${cloudinary.cloudURL}")
  private String cloudinaryUrl;

  @SuppressWarnings("rawtypes")
  public File removeBackground(File image){
    try{
    Cloudinary cloudinary = new Cloudinary(cloudinaryUrl);

    String fileName = image.getName();

    Map uploadImage = cloudinary.uploader().upload(image, ObjectUtils.emptyMap());

    String publicId = (String) uploadImage.get("public_id");

    String transformedUrl = cloudinary.url()
        .transformation(new Transformation()
            .width(800) // Reducir a 800px de ancho (ajusta según necesites)
            .height(800) // Reducir a 800px de alto
            .crop("limit") // Mantener proporción
            .quality(60) // Reducir calidad (30-80 según necesites)
            .fetchFormat("jpg") // Usar JPG en vez de PNG (mucho más liviano)
            .chain().effect("background_removal"))
        .format("png")
        .generate(publicId);
    
    System.out.println("UzRL de imagen transformada: " + transformedUrl);
    
    File downloadedFile = new File(image.getParent(), "fondo_quitado" + fileName);
    
    downloadFileFromURL(transformedUrl, downloadedFile);
    
    return downloadedFile;
  }
    
    catch (IOException e) {
      e.printStackTrace();
      System.out.println(e);
      return null;
    }
      catch (InterruptedException e) {
      e.printStackTrace();
      System.out.println(e);
      return null;
    }
    
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

  public static void downloadFileFromURL(String urlStr, File archivo) throws IOException, InterruptedException {
    HttpClient client = HttpClient.newHttpClient();

    HttpRequest request = HttpRequest.newBuilder()
        .uri(URI.create(urlStr))
        .header("User-Agent", "Java HttpClient") // Agregar user-agent para evitar bloqueos por servidor
        .header("Accept", "image/png")
        .build();

    HttpResponse<Path> response = client.send(request, HttpResponse.BodyHandlers.ofFile(Path.of(archivo.getPath())));

    if (response.statusCode() != 200) {
        throw new IOException("Error al descargar archivo: código HTTP " + response.statusCode());
    }
  }

  public static String convertToBase64(File img) {
    try {
      byte[] imgAsBytes = Files.readAllBytes(img.toPath());
      return Base64.getEncoder().encodeToString(imgAsBytes);
    } catch (Exception e) {
      return null;
    }
  }

  public static byte[] base64ToBytes(String base64Image) {
    return Base64.getDecoder().decode(base64Image);
  }
}
