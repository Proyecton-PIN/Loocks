package pin.loocks.logic.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import pin.loocks.domain.dtos.FilterRequestDTO;
import pin.loocks.domain.dtos.GenerateOutfitSuggestionsRequestDTO;
import pin.loocks.domain.enums.Zona;
import pin.loocks.domain.models.Articulo;
import pin.loocks.domain.models.Outfit;
import pin.loocks.domain.models.PorcentajeColor;

@ExtendWith(MockitoExtension.class)
class OutfitSuggestionServiceUnitTest {

    @Mock
    private ArticuloFilterService articuloFilterService;

    @InjectMocks
    private OutfitSuggestionService outfitSuggestionService;

    @Test
    void generateSuggestions_ShouldCreateOutfit_WhenMatchingClothesExist() {
        // Arrange
        String userId = "user1";
        GenerateOutfitSuggestionsRequestDTO request = new GenerateOutfitSuggestionsRequestDTO();
        request.setLimit(5);

        // Mockear Torso
        Articulo torso = new Articulo();
        torso.setId(1L);
        torso.setZonasCubiertas(List.of(Zona.TORSO));
        torso.setColorPrimario("#000000"); // Negro
        // Necesario para ColorHelper si accede a la lista de colores
        torso.setColores(List.of(new PorcentajeColor("#000000", 100)));

        // Mockear Piernas
        Articulo piernas = new Articulo();
        piernas.setId(2L);
        piernas.setZonasCubiertas(List.of(Zona.PIERNAS));
        piernas.setColorPrimario("#000000"); // Negro (alta afinidad con negro)
        piernas.setColores(List.of(new PorcentajeColor("#000000", 100)));

        // Mockear Pies
        Articulo pies = new Articulo();
        pies.setId(3L);
        pies.setZonasCubiertas(List.of(Zona.PIES));
        pies.setColorPrimario("#FFFFFF"); // Blanco
        pies.setColores(List.of(new PorcentajeColor("#FFFFFF", 100)));

        // Configurar mocks para devolver estas prendas cuando se pidan por zona
        // Nota: El servicio crea un nuevo FilterRequestDTO internamente, por lo que
        // usamos any() o eq() con cuidado

        // 1. Llamada para Torsos
        when(articuloFilterService.getFilteredArticulos(
                any(FilterRequestDTO.class), eq(userId)))
                .thenAnswer(invocation -> {
                    FilterRequestDTO dto = invocation.getArgument(0);
                    if (dto.getZonasCubiertas().contains(Zona.TORSO))
                        return List.of(torso);
                    if (dto.getZonasCubiertas().contains(Zona.PIERNAS))
                        return List.of(piernas);
                    if (dto.getZonasCubiertas().contains(Zona.PIES))
                        return List.of(pies);
                    return List.of();
                });

        // Act
        List<Outfit> result = outfitSuggestionService.generateSuggestions(request, userId);

        // Assert
        assertThat(result).isNotEmpty();
        Outfit outfit = result.get(0);
        assertThat(outfit.getArticulos().get(0)).isEqualTo(torso);
        assertThat(outfit.getArticulos().get(1)).isEqualTo(piernas);
        assertThat(outfit.getArticulos().get(2)).isEqualTo(pies);
    }

    @Test
    void generateSuggestions_ShouldHandleFullBodyItems() {
        // Arrange
        String userId = "user1";
        GenerateOutfitSuggestionsRequestDTO request = new GenerateOutfitSuggestionsRequestDTO();
        request.setLimit(5);

        // Vestido (cubre torso y piernas)
        Articulo vestido = new Articulo();
        vestido.setZonasCubiertas(List.of(Zona.TORSO, Zona.PIERNAS));
        vestido.setColorPrimario("#FF0000");
        vestido.setColores(List.of(new PorcentajeColor("#FF0000", 100)));

        Articulo pies = new Articulo();
        pies.setZonasCubiertas(List.of(Zona.PIES));
        pies.setColorPrimario("#FF0000");
        pies.setColores(List.of(new PorcentajeColor("#FF0000", 100)));

        when(articuloFilterService.getFilteredArticulos(any(FilterRequestDTO.class), eq(userId)))
                .thenAnswer(invocation -> {
                    FilterRequestDTO dto = invocation.getArgument(0);
                    // El servicio pide TORSOS primero
                    if (dto.getZonasCubiertas().contains(Zona.TORSO))
                        return List.of(vestido);
                    if (dto.getZonasCubiertas().contains(Zona.PIES))
                        return List.of(pies);
                    // El servicio pide piernas, pero las filtramos en el stream del servicio
                    if (dto.getZonasCubiertas().contains(Zona.PIERNAS))
                        return List.of();
                    return List.of();
                });

        // Act
        List<Outfit> result = outfitSuggestionService.generateSuggestions(request, userId);

        // Assert
        assertThat(result).isNotEmpty();
        assertThat(result.get(0).getArticulos()).size().isEqualTo(2);
        assertThat(result.get(0).getArticulos().get(0)).isEqualTo(vestido);
    }
}