package pin.loocks.logic.services;

import static org.assertj.core.api.Assertions.assertThat;

import java.sql.Date;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import pin.loocks.data.repositories.ArticuloRepository;
import pin.loocks.data.repositories.PerfilRepository;
import pin.loocks.domain.dtos.FilterRequestDTO;
import pin.loocks.domain.dtos.RegisterRequestDTO;
import pin.loocks.domain.enums.Estacion;
import pin.loocks.domain.enums.Estilo;
import pin.loocks.domain.enums.Zona;
import pin.loocks.domain.models.Armario;
import pin.loocks.domain.models.Articulo;
import pin.loocks.domain.models.Perfil;
import pin.loocks.domain.models.PorcentajeColor;

// @DataJpaTest
// @Import(ArticuloFilterService.class) // Importamos el servicio explícitamente
@SpringBootTest
@Transactional
class ArticuloFilterServiceIntegrationTest {

  @Autowired
  private ArticuloFilterService articuloFilterService;

  @Autowired
  private ArticuloRepository articuloRepository;

  @Autowired
  private PerfilRepository perfilRepository;

  private Perfil p;
  private final String whiteColor = "#FFFFFF";

  @BeforeEach
  void setUp() {
    p = new Perfil(new RegisterRequestDTO("user",
        "user",
        "user",
        "user",
        "User",
        new Date(System.currentTimeMillis())));
    Armario a = new Armario();
    a.setNombre("armario");
    p.setArmario(a);

    perfilRepository.save(p);

    // Crear datos de prueba
    Articulo a1 = new Articulo();
    a1.setUserId(p.getId());
    a1.setEstilo(Estilo.CASUAL);
    a1.setEstacion(Estacion.VERANO);
    a1.setColorPrimario(whiteColor);
    a1.setColores(List.of(new PorcentajeColor(whiteColor, 100)));
    a1.setIsFavorito(true);
    a1.setZonasCubiertas(List.of(Zona.TORSO));
    a1.setNivelDeAbrigo(0.2); // Nota: asumo que el nombre en entidad es nivelDeAbrig como en el servicio
    a1.setPuedePonerseEncimaDeOtraPrenda(false);
    a1.setArmario(p.getArmario());
    a1.setIsFavorito(true);
    a1.setImageUrl("defualt-image-url");

    Articulo a2 = new Articulo();
    a2.setUserId(p.getId());
    a2.setEstilo(Estilo.FORMAL);
    a2.setEstacion(Estacion.INVIERNO);
    a2.setNivelDeAbrigo(0.9);
    a2.setZonasCubiertas(List.of(Zona.PIERNAS));
    a2.setArmario(p.getArmario());
    a2.setImageUrl("defualt-image-url");
    a2.setColorPrimario(whiteColor);
    a1.setColores(List.of(new PorcentajeColor(whiteColor, 100)));

    articuloRepository.saveAll(List.of(a1, a2));
  }

  @Test
  void shouldFilterByEstiloAndEstacion() {
    FilterRequestDTO filter = new FilterRequestDTO();
    filter.setEstilo(Estilo.CASUAL);
    filter.setEstacion(Estacion.VERANO);

    List<Articulo> result = articuloFilterService.getFilteredArticulos(filter, p.getId());

    assertThat(result).hasSize(1);
    assertThat(result.get(0).getEstilo()).isEqualTo(Estilo.CASUAL);
  }

  @Test
  void shouldFilterByNivelDeAbrigo() {
    FilterRequestDTO filter = new FilterRequestDTO();
    filter.setNivelDeAbrigo(0.5); // Queremos abrigo >= 0.5

    List<Articulo> result = articuloFilterService.getFilteredArticulos(filter, p.getId());

    assertThat(result).hasSize(1);
    assertThat(result.get(0).getEstacion()).isEqualTo(Estacion.INVIERNO);
  }

  @Test
  void shouldFilterByZones() {
    FilterRequestDTO filter = new FilterRequestDTO();
    filter.setZonasCubiertas(List.of(Zona.PIERNAS));

    List<Articulo> result = articuloFilterService.getFilteredArticulos(filter, p.getId());

    assertThat(result).hasSize(1);
    assertThat(result.get(0).getZonasCubiertas()).contains(Zona.PIERNAS);
  }

  @Test
  void shouldFilterByColor() {
    FilterRequestDTO filter = new FilterRequestDTO();
    filter.setPrimaryColor(whiteColor);

    List<Articulo> result = articuloFilterService.getFilteredArticulos(filter, p.getId());
    assertThat(result).hasSize(2);
    assertThat(result.get(0).getColorPrimario()).isEqualTo(whiteColor);
  }

  @Test
  void shouldFilterByFavorito() {
    FilterRequestDTO filter = new FilterRequestDTO();
    filter.setIsFavorito(true);

    List<Articulo> result = articuloFilterService.getFilteredArticulos(filter, p.getId());
    assertThat(result).hasSize(1);
    assertThat(result.get(0).getZonasCubiertas().get(0)).isEqualTo(Zona.TORSO);
  }

  @Test
  void withEmptyFields_shouldReturnAll() {
    FilterRequestDTO filter = new FilterRequestDTO();
    filter.setPrimaryColor("");
    filter.setZonasCubiertas(List.of());

    List<Articulo> result = articuloFilterService.getFilteredArticulos(filter, p.getId());
    assertThat(result).hasSize(2);
  }
}