package pin.loocks.logic.services;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

@Service
public class StorageService {
  
  @Value("${supabase.url}")
  private String supabaseUrl;

  @Value("${supabase.key}")
  private String supabaseKey;


    private final RestTemplate restTemplate = new RestTemplate();;

    public String uploadFile(MultipartFile file, String bucketName, String path) throws IOException {
      // URL del endpoint de Supabase Storage
      String url = String.format("%s/storage/v1/object/%s/%s", 
        supabaseUrl, bucketName, path);

      // Configurar headers
      HttpHeaders headers = new HttpHeaders();
      headers.set("Authorization", "Bearer " + supabaseKey);
      headers.setContentType(MediaType.parseMediaType(file.getContentType()));
      
      // Crear la petición con el contenido del archivo
      HttpEntity<byte[]> requestEntity = new HttpEntity<>(file.getBytes(), headers);

      // Hacer la petición POST
      ResponseEntity<String> response = restTemplate.exchange(
        url,
        HttpMethod.POST,
        requestEntity,
        String.class
      );

      if (response.getStatusCode() == HttpStatus.OK) {
        // Retornar la URL pública del archivo
        return url;
      } else {
        throw new RuntimeException("Error al subir archivo: " + response.getStatusCode());
      }
    }

    /**
     * Elimina un archivo de Supabase Storage
     * @param path Ruta del archivo a eliminar
     */
    public void deleteFile(String bucketName, String path) {
      String url = String.format("%s/storage/v1/object/%s/%s", 
        supabaseUrl, bucketName, path);

      HttpHeaders headers = new HttpHeaders();
      headers.set("Authorization", "Bearer " + supabaseKey);

      HttpEntity<Void> requestEntity = new HttpEntity<>(headers);

      restTemplate.exchange(url, HttpMethod.DELETE, requestEntity, String.class);
    }
}
