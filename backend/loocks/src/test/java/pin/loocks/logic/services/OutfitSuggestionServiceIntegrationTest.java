package pin.loocks.logic.services;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import pin.loocks.data.repositories.ArticuloRepository;
import pin.loocks.domain.dtos.GenerateOutfitSuggestionsRequestDTO;
import pin.loocks.domain.enums.Zona;
import pin.loocks.domain.models.Articulo;
import pin.loocks.domain.models.Outfit;
import pin.loocks.domain.models.PorcentajeColor;

@SpringBootTest
@Transactional
class OutfitSuggestionServiceIntegrationTest {

    @Autowired
    private OutfitSuggestionService outfitSuggestionService;

    @Autowired
    private ArticuloRepository articuloRepository;

    private final String USER_ID = "integrationUser";

    @BeforeEach
    void setUp() {
        articuloRepository.deleteAll();

        // Crear set compatible
        Articulo torso = createArticulo(Zona.TORSO, "#000000");
        Articulo pierna = createArticulo(Zona.PIERNAS, "#000000");
        Articulo pies = createArticulo(Zona.PIES, "#FFFFFF");

        // Crear set incompatible (color clash si ColorHelper es estricto,
        // pero para este test básico aseguramos existencia)

        articuloRepository.saveAll(List.of(torso, pierna, pies));
    }

    @Test
    void shouldGenerateOutfitsFromDatabase() {
        GenerateOutfitSuggestionsRequestDTO request = new GenerateOutfitSuggestionsRequestDTO();
        request.setLimit(5);

        List<Outfit> suggestions = outfitSuggestionService.generateSuggestions(request, USER_ID);

        assertThat(suggestions).isNotEmpty();
        assertThat(suggestions.get(0).getArticulos().get(0)).isNotNull();
        assertThat(suggestions.get(0).getArticulos().get(2)).isNotNull();
    }

    private Articulo createArticulo(Zona zona, String hexColor) {
        Articulo a = new Articulo();
        a.setUserId(USER_ID);
        a.setZonasCubiertas(List.of(zona));
        a.setColorPrimario(hexColor);
        a.setColores(List.of(new PorcentajeColor(hexColor, 100)));
        a.setPuedePonerseEncimaDeOtraPrenda(false);
        // Valores por defecto para evitar NullPointer en filtros
        a.setNivelDeAbrigo(0.5);
        return a;
    }
}