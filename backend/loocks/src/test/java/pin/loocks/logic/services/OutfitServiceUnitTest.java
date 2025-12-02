package pin.loocks.logic.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mockStatic;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;

import pin.loocks.data.apis.LLMApi;
import pin.loocks.data.repositories.ArticuloRepository;
import pin.loocks.data.repositories.OutfitLogRepository;
import pin.loocks.data.repositories.OutfitRepository;
import pin.loocks.domain.dtos.FilterRequestDTO;
import pin.loocks.domain.dtos.GenerateOutfitSuggestionsRequestDTO;
import pin.loocks.domain.enums.Estacion;
import pin.loocks.domain.enums.Estilo;
import pin.loocks.domain.enums.Zona;
import pin.loocks.domain.models.Articulo;
import pin.loocks.domain.models.Outfit;
import pin.loocks.logic.helpers.ColorHelper;

@ExtendWith(MockitoExtension.class)
public class OutfitServiceUnitTest {

        @Mock
        private ArticuloService articuloService; // Colaborador clave

        // Otros Mocks necesarios para que OutfitService se inyecte, aunque no se usen
        // en generateSuggestions
        @Mock
        private OutfitRepository outfitRepository;
        @Mock
        private OutfitLogRepository outfitLogRepository;
        @Mock
        private ArticuloRepository articuloRepository;
        @Mock
        private LLMApi llmApi;

        @InjectMocks
        private OutfitService outfitService;

        private GenerateOutfitSuggestionsRequestDTO request;
        private final String userId = "testUser";
        private MockedStatic<ColorHelper> mockedColorHelper;

        @BeforeEach
        void setUp() {
                request = new GenerateOutfitSuggestionsRequestDTO();
                request.setLimit(5);
                mockedColorHelper = mockStatic(ColorHelper.class);
        }

        @AfterEach
        void tearDown() {
                mockedColorHelper.close();
        }

        private Articulo createMockArticulo(Long id, Zona zona, boolean singleZone) {
                Articulo articulo = new Articulo();
                articulo.setId(id);
                articulo.setNombre("Articulo " + id);
                articulo.setEstilo(Estilo.CASUAL);
                articulo.setEstacion(Estacion.VERANO);
                articulo.setUserId(userId);

                if (singleZone) {
                        articulo.setZonasCubiertas(List.of(zona));
                } else {
                        articulo.setZonasCubiertas(List.of(Zona.TORSO, Zona.PIERNAS));
                }
                return articulo;
        }

        @Test
        void generateSuggestions_ShouldReturnCorrectNumberOfOutfits_WhenCompatible() {
                // Arrange
                Articulo torso1 = createMockArticulo(1L, Zona.TORSO, true);
                Articulo torso2 = createMockArticulo(2L, Zona.TORSO, true);
                Articulo pierna1 = createMockArticulo(3L, Zona.PIERNAS, true);
                Articulo pierna2 = createMockArticulo(4L, Zona.PIERNAS, true);
                Articulo pie1 = createMockArticulo(5L, Zona.PIES, true);

                List<Articulo> torsos = List.of(torso1, torso2);
                List<Articulo> piernas = List.of(pierna1, pierna2);
                List<Articulo> pies = List.of(pie1);

                when(articuloService.getFilteredArticulos(any(FilterRequestDTO.class), anyString()))
                                .thenReturn(torsos)
                                .thenReturn(piernas)
                                .thenReturn(pies);

                // Simular que todas las combinaciones torso-pierna son compatibles
                mockedColorHelper
                                .when(() -> ColorHelper.calculateColorAffinity(any(Articulo.class), any(Articulo.class),
                                                eq(null)))
                                .thenReturn(0.6); // > 0.5 (Compatible)

                // Simular que siempre se encuentra el mejor pie
                mockedColorHelper
                                .when(() -> ColorHelper.calculateColorAffinity(any(Articulo.class), any(Articulo.class),
                                                any(Articulo.class)))
                                .thenReturn(0.9);

                // Act
                List<Outfit> suggestions = outfitService.generateSuggestions(request, userId);

                // Assert
                // 2 torsos * 2 piernas * 1 pie = 4 outfits
                assertEquals(4, suggestions.size());
                assertTrue(suggestions.stream().allMatch(o -> o.getArticulos().size() == 3),
                                "Todos los outfits tienen 3 artículos");
        }

        @Test
        void generateSuggestions_ShouldFilterOutIncompatibleColorCombinations() {
                // Arrange
                Articulo torso = createMockArticulo(1L, Zona.TORSO, true);
                Articulo piernaCompatible = createMockArticulo(3L, Zona.PIERNAS, true);
                Articulo piernaIncompatible = createMockArticulo(4L, Zona.PIERNAS, true);
                Articulo pie = createMockArticulo(5L, Zona.PIES, true);

                when(articuloService.getFilteredArticulos(any(FilterRequestDTO.class), anyString()))
                                .thenReturn(List.of(torso))
                                .thenReturn(List.of(piernaCompatible, piernaIncompatible))
                                .thenReturn(List.of(pie));

                // Configurar compatibilidad: Compatible con piernaCompatible, Incompatible con
                // piernaIncompatible
                mockedColorHelper
                                .when(() -> ColorHelper.calculateColorAffinity(torso, piernaCompatible, null))
                                .thenReturn(0.6); // Compatible

                mockedColorHelper
                                .when(() -> ColorHelper.calculateColorAffinity(torso, piernaIncompatible, null))
                                .thenReturn(0.4); // Incompatible (< 0.5)

                // Simular que siempre se encuentra el mejor pie
                mockedColorHelper
                                .when(() -> ColorHelper.calculateColorAffinity(any(Articulo.class), any(Articulo.class),
                                                any(Articulo.class)))
                                .thenReturn(0.9);

                // Act
                List<Outfit> suggestions = outfitService.generateSuggestions(request, userId);

                // Assert
                // Solo se espera (torso, piernaCompatible, pie)
                assertEquals(1, suggestions.size());
                assertTrue(suggestions.get(0).getArticulos().contains(torso));
                assertTrue(suggestions.get(0).getArticulos().contains(piernaCompatible));
        }

        @Test
        void generateSuggestions_ShouldRespectTheLimit() {
                // Arrange: Se generarán 4 combinaciones, pero el límite es 3.
                request.setLimit(3);
                Articulo torso1 = createMockArticulo(1L, Zona.TORSO, true);
                Articulo torso2 = createMockArticulo(2L, Zona.TORSO, true);
                Articulo pierna1 = createMockArticulo(3L, Zona.PIERNAS, true);
                Articulo pierna2 = createMockArticulo(4L, Zona.PIERNAS, true);
                Articulo pie1 = createMockArticulo(5L, Zona.PIES, true);

                when(articuloService.getFilteredArticulos(any(FilterRequestDTO.class), anyString()))
                                .thenReturn(List.of(torso1, torso2))
                                .thenReturn(List.of(pierna1, pierna2))
                                .thenReturn(List.of(pie1));

                // Simular compatibilidad total
                mockedColorHelper
                                .when(() -> ColorHelper.calculateColorAffinity(any(Articulo.class), any(Articulo.class),
                                                eq(null)))
                                .thenReturn(0.6);
                mockedColorHelper
                                .when(() -> ColorHelper.calculateColorAffinity(any(Articulo.class), any(Articulo.class),
                                                any(Articulo.class)))
                                .thenReturn(0.9);

                // Act
                List<Outfit> suggestions = outfitService.generateSuggestions(request, userId);

                // Assert
                assertEquals(3, suggestions.size(), "Debe retornar solo la cantidad definida por el límite.");
        }
}