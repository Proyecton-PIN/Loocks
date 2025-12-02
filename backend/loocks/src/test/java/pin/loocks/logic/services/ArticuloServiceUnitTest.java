package pin.loocks.logic.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import pin.loocks.data.apis.LLMApi;
import pin.loocks.data.repositories.ArticuloRepository;
import pin.loocks.domain.dtos.FilterRequestDTO;
import pin.loocks.domain.models.Articulo;
import pin.loocks.logic.helpers.ImageHelper;

@ExtendWith(MockitoExtension.class)
public class ArticuloServiceUnitTest {

  @Mock
  private ArticuloRepository articuloRepository;

  // Mocks para que se inyecte ArticuloService, aunque no se usen en este método
  @Mock
  private LLMApi llmApi;
  @Mock
  private ImageHelper imageHelper;
  @Mock
  private StorageService storageService;

  @InjectMocks
  private ArticuloService articuloService;

  private Articulo createMockArticulo(Long id, String nombre) {
    Articulo a = new Articulo();
    a.setId(id);
    a.setNombre(nombre);
    return a;
  }

  @Test
  void getFilteredArticulos_ShouldCallRepositoryWithCorrectPageable() {
    // Arrange
    String userId = "testUser";
    int limit = 5;
    int offset = 10;
    FilterRequestDTO filter = new FilterRequestDTO();
    filter.setLimit(limit);
    filter.setOffset(offset); // Pagina 2 (offset 10 / limit 5 = 2)

    Articulo articulo1 = createMockArticulo(1L, "Camisa");
    List<Articulo> mockContent = List.of(articulo1);
    Page<Articulo> mockPage = new PageImpl<>(mockContent);

    // Se espera que la página sea (offset / limit)
    Pageable expectedPageable = PageRequest.of(offset / limit, limit);

    when(articuloRepository.findAll(any(Specification.class), eq(expectedPageable)))
        .thenReturn(mockPage);

    // Act
    List<Articulo> result = articuloService.getFilteredArticulos(filter, userId);

    // Assert
    // 1. Verificar que se llamó a findAll con la especificación y el Pageable
    // correcto
    verify(articuloRepository).findAll(any(Specification.class), eq(expectedPageable));

    // 2. Verificar el contenido
    assertEquals(1, result.size());
    assertEquals("Camisa", result.get(0).getNombre());
  }
}