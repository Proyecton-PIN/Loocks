package pin.loocks.data.apis;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

public class RestApi<T> {
  private final RestTemplate restTemplate;
  private final String url;
  private Class<T> responseType;
  private final HttpHeaders headers;
  private final Map<String, Object> body;
  private Boolean isMultipart;
  private final MultiValueMap<String, Object> multipartBody;

  public RestApi(String url, Class<T> responseType) {
    this.restTemplate = new RestTemplate();
    this.headers = new HttpHeaders();
    this.body = new HashMap<>();
    this.url = url;
    this.responseType = responseType;
    this.isMultipart = false;
    this.multipartBody = new LinkedMultiValueMap<>();
  }

  public RestApi<T> asMultipart() {
    this.isMultipart = true;
    this.setContentType(MediaType.MULTIPART_FORM_DATA);
    return this;
  }

  public RestApi<T> addFormFile(String key, File file) {
    if (!this.isMultipart)
      return this;
    Resource resource = new FileSystemResource(file);
    this.multipartBody.add(key, resource);
    return this;
  }

  public RestApi<T> addFormFiles(String key, List<File> files) {
    if (!this.isMultipart)
      return this;

    for (File file : files) {
      Resource resource = new FileSystemResource(file);
      this.multipartBody.add(key, resource);
    }

    return this;
  }

  public RestApi<T> addFormParam(String key, Object value) {
    if (!this.isMultipart)
      return this;
    this.multipartBody.add(key, value);
    return this;
  }

  public RestApi<T> addHeader(String key, String value) {
    this.headers.add(key, value);
    return this;
  }

  public RestApi<T> setContentType(MediaType mediaType) {
    this.headers.setContentType(mediaType);
    return this;
  }

  public RestApi<T> addBodyParam(String key, Object value) {
    this.body.put(key, value);
    return this;
  }

  public RestApi<T> addBody(Map<String, Object> body) {
    this.body.putAll(body);
    return this;
  }

  public ResponseEntity<T> execute() {
    HttpEntity<?> request = new HttpEntity<>(
        this.isMultipart
            ? this.multipartBody
            : this.body,
        this.headers);

    return restTemplate.postForEntity(
        this.url,
        request,
        responseType);
  }

  public T executeAndGetBody() {
    return execute().getBody();
  }
}
