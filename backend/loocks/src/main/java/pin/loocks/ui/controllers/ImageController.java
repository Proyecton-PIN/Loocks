package pin.loocks.ui.controllers;

import java.io.File;
import java.io.IOException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import pin.loocks.data.apis.LLMApi;
import pin.loocks.domain.dtos.ClothingAnalysisDTO;
import pin.loocks.logic.helpers.ImageHelper;


@RestController
@RequestMapping("/api/image")
public class ImageController {
  @PostMapping("removeBackground")
  public ResponseEntity<File> postMethodName(
    @AuthenticationPrincipal UserDetails userDetails, 
    @RequestParam("file") MultipartFile img
  ) throws IOException {
    File tempFile = File.createTempFile("upload-", img.getOriginalFilename());
    img.transferTo(tempFile);

    try {
      if (img.isEmpty()) {
        return ResponseEntity.badRequest().build();
      }
        
      File result = ImageHelper.removeBackground(tempFile);
      return ResponseEntity.ok(result);

    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    } finally {
      tempFile.delete();
    }
  }

  @PostMapping("zipImage")
  public ResponseEntity<File> zipImage(
    @AuthenticationPrincipal UserDetails userDetails, 
    @RequestParam("file") MultipartFile img
  ) throws IOException {
    File tempFile = File.createTempFile("upload-", img.getOriginalFilename());
    img.transferTo(tempFile);

    try {
      if (img.isEmpty()) {
        return ResponseEntity.badRequest().build();
      }
        
      File result = ImageHelper.zip(tempFile);
      return ResponseEntity.ok(result);

    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    } finally {
      tempFile.delete();
    }
  }

  @PostMapping("generateDetails")
  public ResponseEntity<ClothingAnalysisDTO> generateDetails(
    @AuthenticationPrincipal UserDetails userDetails,
    @RequestParam("file") MultipartFile img
  ) throws IOException {
    File tempFile = File.createTempFile("upload-", img.getOriginalFilename());
    img.transferTo(tempFile);

    try {
      if (img.isEmpty()) {
        return ResponseEntity.badRequest().build();
      }
        
      ClothingAnalysisDTO result = LLMApi.generateDetails(tempFile);
      return ResponseEntity.ok(result);

    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    } finally {
      tempFile.delete();
    }
  }
  
}
