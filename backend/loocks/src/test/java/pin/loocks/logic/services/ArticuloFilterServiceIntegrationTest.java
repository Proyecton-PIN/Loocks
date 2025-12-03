package pin.loocks.logic.services;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;

import pin.loocks.data.repositories.ArticuloRepository;
import pin.loocks.domain.dtos.FilterRequestDTO;
import pin.loocks.domain.enums.Estacion;
import pin.loocks.domain.enums.Estilo;
import pin.loocks.domain.enums.Zona;
import pin.loocks.domain.models.Articulo;

@DataJpaTest
@Import(ArticuloFilterService.class) // Importamos el servicio explícitamente
class ArticuloFilterServiceIntegrationTest {

    @Autowired
    private ArticuloFilterService articuloFilterService;

    @Autowired
    private ArticuloRepository articuloRepository;

    private final String USER_ID = "testUser";

    @BeforeEach
    void setUp() {
        articuloRepository.deleteAll();

        // Crear datos de prueba
        Articulo a1 = new Articulo();
        a1.setUserId(USER_ID);
        a1.setEstilo(Estilo.CASUAL);
        a1.setEstacion(Estacion.VERANO);
        a1.setColorPrimario("#FFFFFF");
        a1.setIsFavorito(true);
        a1.setZonasCubiertas(List.of(Zona.TORSO));
        a1.setNivelDeAbrigo(0.2); // Nota: asumo que el nombre en entidad es nivelDeAbrig como en el servicio
        a1.setPuedePonerseEncimaDeOtraPrenda(false);

        Articulo a2 = new Articulo();
        a2.setUserId(USER_ID);
        a2.setEstilo(Estilo.FORMAL);
        a2.setEstacion(Estacion.INVIERNO);
        a2.setNivelDeAbrigo(0.9);
        a2.setZonasCubiertas(List.of(Zona.PIERNAS));

        articuloRepository.saveAll(List.of(a1, a2));
    }

    @Test
    void shouldFilterByEstiloAndEstacion() {
        FilterRequestDTO filter = new FilterRequestDTO();
        filter.setEstilo(Estilo.CASUAL);
        filter.setEstacion(Estacion.VERANO);

        List<Articulo> result = articuloFilterService.getFilteredArticulos(filter, USER_ID);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getEstilo()).isEqualTo(Estilo.CASUAL);
    }

    @Test
    void shouldFilterByNivelDeAbrigo() {
        FilterRequestDTO filter = new FilterRequestDTO();
        filter.setNivelDeAbrigo(0.5); // Queremos abrigo >= 0.5

        List<Articulo> result = articuloFilterService.getFilteredArticulos(filter, USER_ID);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getEstacion()).isEqualTo(Estacion.INVIERNO);
    }

    @Test
    void shouldFilterByZones() {
        FilterRequestDTO filter = new FilterRequestDTO();
        filter.setZonasCubiertas(List.of(Zona.PIERNAS));

        List<Articulo> result = articuloFilterService.getFilteredArticulos(filter, USER_ID);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getZonasCubiertas()).contains(Zona.PIERNAS);
    }
}