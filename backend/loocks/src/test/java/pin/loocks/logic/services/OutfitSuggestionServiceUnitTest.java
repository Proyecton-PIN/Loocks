package pin.loocks.logic.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.stream.Stream;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import pin.loocks.domain.dtos.FilterRequestDTO;
import pin.loocks.domain.dtos.GenerateOutfitSuggestionsRequestDTO;
import pin.loocks.domain.enums.Estacion;
import pin.loocks.domain.enums.Estilo;
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
        request.setTemperatura(0.0);

        // Mockear Torso
        Articulo torso = new Articulo();
        torso.setId(1L);
        torso.setZonasCubiertas(List.of(Zona.TORSO));
        torso.setColorPrimario("#000000"); // Negro
        // Necesario para ColorHelper si accede a la lista de colores
        torso.setColores(List.of(new PorcentajeColor("#000000", 100)));
        torso.setEstilo(Estilo.CASUAL);
        torso.setNivelDeAbrigo(1.0);

        // Mockear Piernas
        Articulo piernas = new Articulo();
        piernas.setId(2L);
        piernas.setZonasCubiertas(List.of(Zona.PIERNAS));
        piernas.setColorPrimario("#000000"); // Negro (alta afinidad con negro)
        piernas.setColores(List.of(new PorcentajeColor("#000000", 100)));
        piernas.setEstilo(Estilo.CASUAL);
        piernas.setNivelDeAbrigo(1.0);

        // Mockear Pies
        Articulo pies = new Articulo();
        pies.setId(3L);
        pies.setZonasCubiertas(List.of(Zona.PIES));
        pies.setColorPrimario("#FFFFFF"); // Blanco
        pies.setColores(List.of(new PorcentajeColor("#FFFFFF", 100)));
        pies.setEstilo(Estilo.CASUAL);
        pies.setNivelDeAbrigo(1.0);

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
        vestido.setEstilo(Estilo.CASUAL);

        Articulo piernas = new Articulo();
        piernas.setZonasCubiertas(List.of(Zona.TORSO, Zona.PIERNAS));
        piernas.setColorPrimario("#FF0000");
        vestido.setColores(List.of(new PorcentajeColor("#FF0000", 100)));
        vestido.setEstilo(Estilo.CASUAL);

        Articulo pies = new Articulo();
        pies.setZonasCubiertas(List.of(Zona.PIES));
        pies.setColorPrimario("#FF0000");
        pies.setColores(List.of(new PorcentajeColor("#FF0000", 100)));
        pies.setEstilo(Estilo.CASUAL);

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
                        return List.of(piernas);
                    return List.of();
                });

        // Act
        List<Outfit> result = outfitSuggestionService.generateSuggestions(request, userId);

        // Assert
        assertThat(result).isNotEmpty();
        assertThat(result.get(0).getArticulos()).size().isEqualTo(2);
        assertThat(result.get(0).getArticulos().get(0)).isEqualTo(vestido);
    }

    @Test
    void generateSuggestions_ShouldHandleColorMismatch() {
        // Arrange
        String userId = "user1";
        GenerateOutfitSuggestionsRequestDTO request = new GenerateOutfitSuggestionsRequestDTO();
        request.setLimit(5);

        // Vestido (cubre torso y piernas)
        Articulo vestido = new Articulo();
        vestido.setZonasCubiertas(List.of(Zona.TORSO, Zona.PIERNAS));
        vestido.setColorPrimario("#10d039");
        vestido.setColores(List.of(new PorcentajeColor("#10d039", 100)));
        vestido.setEstilo(Estilo.CASUAL);

        Articulo pies = new Articulo();
        pies.setZonasCubiertas(List.of(Zona.PIES));
        pies.setColorPrimario("#FF0000");
        pies.setColores(List.of(new PorcentajeColor("#FF0000", 100)));
        pies.setEstilo(Estilo.CASUAL);

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
        assertThat(result).isEmpty();
    }

    static Stream<Object> estacionDataSource() {
        return Stream.of(
                Arguments.of(Estacion.VERANO, -1.0),
                Arguments.of(Estacion.ENTRETIEMPO, -1.0),
                Arguments.of(Estacion.INVIERNO, -1.0),
                Arguments.of(Estacion.OTONO, -1.0),
                Arguments.of(Estacion.PRIMAVERA, -1.0),

                Arguments.of(Estacion.VERANO, 21),
                Arguments.of(Estacion.ENTRETIEMPO, 21),
                Arguments.of(Estacion.INVIERNO, 21),
                Arguments.of(Estacion.OTONO, 21),
                Arguments.of(Estacion.PRIMAVERA, 21));
    }

    @ParameterizedTest
    @MethodSource("estacionDataSource")
    void generateSuggestions_ShouldHandleNivelOfAbrigo(Estacion estacion, double temperatura) {
        // Arrange
        String userId = "user1";
        GenerateOutfitSuggestionsRequestDTO request = new GenerateOutfitSuggestionsRequestDTO();
        request.setTemperatura(temperatura);
        request.setEstacion(estacion);

        // Vestido (cubre torso y piernas)
        Articulo vestido = new Articulo();
        vestido.setZonasCubiertas(List.of(Zona.TORSO, Zona.PIERNAS));
        vestido.setColorPrimario("#FF0000");
        vestido.setColores(List.of(new PorcentajeColor("#FF0000", 100)));
        vestido.setEstilo(Estilo.CASUAL);
        vestido.setNivelDeAbrigo(0.1);

        Articulo pies = new Articulo();
        pies.setZonasCubiertas(List.of(Zona.PIES));
        pies.setColorPrimario("#FF0000");
        pies.setColores(List.of(new PorcentajeColor("#FF0000", 100)));
        pies.setEstilo(Estilo.CASUAL);
        pies.setNivelDeAbrigo(0.1);

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
        assertThat(result).isEmpty();
    }

    static Stream<Object> zonaCubiertaDataSource() {
        return Stream.of(
                Arguments.of(Zona.TORSO),
                Arguments.of(Zona.PIERNAS),
                Arguments.of(Zona.PIES));
    }

    @ParameterizedTest
    @MethodSource("zonaCubiertaDataSource")
    void generateSuggestions_ShouldHandleBaseArticulo(Zona zonaCubierta) {
        // Arrange
        String userId = "user1";
        GenerateOutfitSuggestionsRequestDTO request = new GenerateOutfitSuggestionsRequestDTO();
        Articulo baseArticulo = new Articulo();
        baseArticulo.setZonasCubiertas(List.of(zonaCubierta));
        baseArticulo.setColorPrimario("#FF0000");
        baseArticulo.setColores(List.of(new PorcentajeColor("#FF0000", 100)));
        baseArticulo.setEstilo(Estilo.CASUAL);
        baseArticulo.setNivelDeAbrigo(1.0);
        baseArticulo.setId(10L);
        request.setPrendaBase(baseArticulo);

        // Mockear Torso
        Articulo torso = new Articulo();
        torso.setId(1L);
        torso.setZonasCubiertas(List.of(Zona.TORSO));
        torso.setColorPrimario("#000000"); // Negro
        // Necesario para ColorHelper si accede a la lista de colores
        torso.setColores(List.of(new PorcentajeColor("#000000", 100)));
        torso.setEstilo(Estilo.CASUAL);
        torso.setNivelDeAbrigo(1.0);

        // Mockear Piernas
        Articulo piernas = new Articulo();
        piernas.setId(2L);
        piernas.setZonasCubiertas(List.of(Zona.PIERNAS));
        piernas.setColorPrimario("#000000"); // Negro (alta afinidad con negro)
        piernas.setColores(List.of(new PorcentajeColor("#000000", 100)));
        piernas.setEstilo(Estilo.CASUAL);
        piernas.setNivelDeAbrigo(1.0);

        // Mockear Pies
        Articulo pies = new Articulo();
        pies.setId(3L);
        pies.setZonasCubiertas(List.of(Zona.PIES));
        pies.setColorPrimario("#FFFFFF"); // Blanco
        pies.setColores(List.of(new PorcentajeColor("#FFFFFF", 100)));
        pies.setEstilo(Estilo.CASUAL);
        pies.setNivelDeAbrigo(1.0);

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
        assertThat(result.get(0).getArticulos()).contains(baseArticulo);
    }

    @Test
    void generateSuggestions_ShouldHandleNivelDeAbrigoWithAbrigo() {
        // Arrange
        String userId = "user1";
        GenerateOutfitSuggestionsRequestDTO request = new GenerateOutfitSuggestionsRequestDTO();
        request.setLimit(1);
        request.setTemperatura(5.0);
        request.setEstacion(Estacion.INVIERNO);

        // Vestido (cubre torso y piernas)
        Articulo vestido = new Articulo();
        vestido.setZonasCubiertas(List.of(Zona.TORSO, Zona.PIERNAS));
        vestido.setColorPrimario("#FF0000");
        vestido.setColores(List.of(new PorcentajeColor("#FF0000", 100)));
        vestido.setEstilo(Estilo.CASUAL);
        vestido.setNivelDeAbrigo(0.6);

        Articulo pies1 = new Articulo();
        pies1.setZonasCubiertas(List.of(Zona.PIES));
        pies1.setColorPrimario("#FF0000");
        pies1.setColores(List.of(new PorcentajeColor("#FF0000", 100)));
        pies1.setEstilo(Estilo.CASUAL);
        pies1.setNivelDeAbrigo(0.6);

        Articulo pies2 = new Articulo();
        pies2.setZonasCubiertas(List.of(Zona.PIES));
        pies2.setColorPrimario("#FF0000");
        pies2.setColores(List.of(new PorcentajeColor("#FF0000", 100)));
        pies2.setEstilo(Estilo.CASUAL);
        pies2.setNivelDeAbrigo(0.6);

        Articulo abrigo1 = new Articulo();
        abrigo1.setZonasCubiertas(List.of(Zona.TORSO));
        abrigo1.setColorPrimario("#FF0000");
        abrigo1.setColores(List.of(new PorcentajeColor("#FF0000", 100)));
        abrigo1.setEstilo(Estilo.CASUAL);
        abrigo1.setNivelDeAbrigo(1.0);

        Articulo abrigo2 = new Articulo();
        abrigo1.setZonasCubiertas(List.of(Zona.TORSO));
        abrigo1.setColorPrimario("#FF0000");
        abrigo1.setColores(List.of(new PorcentajeColor("#FF0000", 100)));
        abrigo1.setEstilo(Estilo.CASUAL);
        abrigo1.setNivelDeAbrigo(0.4);

        when(articuloFilterService.getFilteredArticulos(any(FilterRequestDTO.class), eq(userId)))
                .thenAnswer(invocation -> {
                    FilterRequestDTO dto = invocation.getArgument(0);
                    // El servicio pide TORSOS primero
                    if (dto.getZonasCubiertas().contains(Zona.TORSO))
                        return List.of(vestido);
                    if (dto.getZonasCubiertas().contains(Zona.PIES))
                        return List.of(pies1, pies2);
                    // El servicio pide piernas, pero las filtramos en el stream del servicio
                    if (dto.getZonasCubiertas().contains(Zona.PIERNAS))
                        return List.of();
                    if (dto.getPuedePonerseEncimaDeOtraPrenda() == true)
                        return List.of(abrigo1, abrigo2);
                    return List.of();
                });

        // Act
        List<Outfit> result = outfitSuggestionService.generateSuggestions(request, userId);

        // Assert
        assertThat(result).size().isEqualTo(1);
        assertThat(result.get(0).getArticulos()).contains(abrigo1);
    }
}