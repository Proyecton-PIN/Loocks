package pin.loocks.ui.controllers;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import io.swagger.v3.oas.annotations.Parameter;
import pin.loocks.data.apis.LLMApi;
import pin.loocks.domain.dtos.ClothingAnalysisDTO;
import pin.loocks.logic.helpers.ImageHelper;


@RestController
@RequestMapping("/api/image")
public class ImageController {
  @Autowired
  private LLMApi llmApi;

  @Autowired
  private ImageHelper imageHelper;

  @PostMapping("removeBackground")
  public ResponseEntity<Resource> postMethodName(
    @AuthenticationPrincipal UserDetails userDetails, 
    @Parameter(description = "Image file", required = true)
    @RequestParam("file") MultipartFile img
  ) throws IOException {
    File tempFile = File.createTempFile("upload-", img.getOriginalFilename());
    img.transferTo(tempFile);

    try {
      if (img.isEmpty()) {
        return ResponseEntity.badRequest().build();
      }
      
      File result = imageHelper.removeBackground(tempFile);
      InputStreamResource resource = new InputStreamResource(new FileInputStream(result));
      
      return ResponseEntity.ok()
        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"compressed-" + img.getOriginalFilename() + "\"")
        .contentType(MediaType.APPLICATION_OCTET_STREAM)
        .contentLength(result.length())
        .body(resource);

    } catch (Exception e) {
      System.out.println(e);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    } finally {
      tempFile.delete();
    }
  }

  
  @PostMapping(value = "zipImage", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<Resource> zipImage(
    @AuthenticationPrincipal UserDetails userDetails, 
    @Parameter(description = "Image file", required = true)
    @RequestParam("file") MultipartFile img
  ) throws IOException {
    File tempFile = File.createTempFile("upload-", img.getOriginalFilename());
    img.transferTo(tempFile);

    try {
      if (img.isEmpty()) {
        return ResponseEntity.badRequest().build();
      }
        
      File result = ImageHelper.zip(tempFile);
      InputStreamResource resource = new InputStreamResource(new FileInputStream(result));
        

      return ResponseEntity.ok()
        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"compressed-" + img.getOriginalFilename() + "\"")
        .contentType(MediaType.APPLICATION_OCTET_STREAM)
        .contentLength(result.length())
        .body(resource);

    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    } finally {
      tempFile.delete();
    }
  }

  @PostMapping(value = "generateDetails", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<ClothingAnalysisDTO> generateDetails(
    @AuthenticationPrincipal UserDetails userDetails,
    @Parameter(description = "Image file", required = true)
    @RequestParam("file") MultipartFile img
  ) throws IOException {
    File tempFile = File.createTempFile("upload-", img.getOriginalFilename());
    img.transferTo(tempFile);

    if (img.isEmpty())
      return ResponseEntity.badRequest().build();

    try {
      ClothingAnalysisDTO result = llmApi.generateDetails(tempFile);
      return ResponseEntity.ok(result);

    } catch (Exception e) {
      System.out.println(e.getMessage());
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    } finally {
      tempFile.delete();
    }
  }
}
