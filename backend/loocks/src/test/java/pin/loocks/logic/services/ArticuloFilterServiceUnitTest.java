package pin.loocks.logic.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
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
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import pin.loocks.data.repositories.ArticuloRepository;
import pin.loocks.domain.dtos.FilterRequestDTO;
import pin.loocks.domain.enums.TipoArticulo;
import pin.loocks.domain.models.Articulo;

@ExtendWith(MockitoExtension.class)
class ArticuloFilterServiceUnitTest {

    @Mock
    private ArticuloRepository articuloRepository;

    @InjectMocks
    private ArticuloFilterService articuloFilterService;

    @Test
    void getFilteredArticulos_ShouldReturnList_WhenRepositoryReturnsPage() {
        // Arrange
        String userId = "user123";
        FilterRequestDTO filter = new FilterRequestDTO();
        filter.setLimit(10);
        filter.setOffset(0);

        Articulo articulo = new Articulo();
        Page<Articulo> page = new PageImpl<>(List.of(articulo));

        when(articuloRepository.findAll(any(Specification.class), any(Pageable.class)))
                .thenReturn(page);

        // Act
        List<Articulo> result = articuloFilterService.getFilteredArticulos(filter, userId);

        // Assert
        assertEquals(1, result.size());
        verify(articuloRepository).findAll(any(Specification.class), any(Pageable.class));
    }

    @Test
    void getArticulosByTipo_ShouldReturnList_WhenTipoIsNotNull() {
        // Arrange
        String userId = "user123";
        TipoArticulo tipo = TipoArticulo.ACCESORIOS;
        List<Articulo> expectedList = List.of(new Articulo());

        when(articuloRepository.findByUserIdAndTipo(userId, tipo)).thenReturn(expectedList);

        // Act
        List<Articulo> result = articuloFilterService.getArticulosByTipo(tipo, userId);

        // Assert
        assertEquals(expectedList, result);
        verify(articuloRepository).findByUserIdAndTipo(userId, tipo);
    }

    @Test
    void getArticulosByTipo_ShouldReturnEmpty_WhenTipoIsNull() {
        // Act
        List<Articulo> result = articuloFilterService.getArticulosByTipo(null, "user1");

        // Assert
        assertEquals(0, result.size());
    }
}