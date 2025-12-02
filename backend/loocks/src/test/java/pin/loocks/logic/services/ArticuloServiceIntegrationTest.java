package pin.loocks.logic.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

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
import pin.loocks.domain.enums.TipoArticulo;
import pin.loocks.domain.enums.Zona;
import pin.loocks.domain.models.Armario;
import pin.loocks.domain.models.Articulo;
import pin.loocks.domain.models.Perfil;
import pin.loocks.domain.models.PorcentajeColor;

// Importamos ArticuloService para que sea descubierto por Spring
@Import(ArticuloService.class)
@DataJpaTest
public class ArticuloServiceIntegrationTest {

  // Se inyecta ArticuloService, el que tiene la lógica de filtro (getFilterSpecs)
  @Autowired
  private ArticuloService articuloService;

  // Se inyecta el Repository para poder inicializar los datos en la BD
  @Autowired
  private ArticuloRepository articuloRepository;

  // Asumo que se necesita un Armario para satisfacer la FK en Articulo
  // En un test real, necesitarías persistir Armario, pero a menudo @DataJpaTest
  // lo maneja.
  // Para simplificar, asumo que puedo construir un Articulo y Armario básico.

  private final String USER_ID = "usuario_a";
  private final String OTHER_USER_ID = "usuario_b";
  private Armario armarioA;

  @BeforeEach
  void setUp() {
    articuloRepository.deleteAll();

    // Setup base de datos en memoria H2
    armarioA = new Armario();
    armarioA.setId(1L);
    Perfil perfil = new Perfil();
    perfil.setId(USER_ID);
    armarioA.setPerfil(perfil);
    // En un test real, se guardaría Armario, pero ArticuloService no depende de
    // ArmarioRepository
    // Por la limitación de Armario.java, lo omitimos.

    // Articulo 1: Casual/Verano, Torso, Rojo, Favorito, Abrigo 0.2,
    // PonerseEncima=true
    Articulo a1 = createArticulo(USER_ID, Estilo.CASUAL, Estacion.VERANO, "Rojo", List.of(Zona.TORSO));
    a1.setIsFavorito(true);
    a1.setNivelDeAbrigo(0.2);
    a1.setPuedePonerseEncimaDeOtraPrenda(true);

    // Articulo 2: Deportivo/Invierno, Piernas/Pies, Azul, No Favorito, Abrigo 1.0,
    // PonerseEncima=false
    Articulo a2 = createArticulo(USER_ID, Estilo.DEPORTIVO, Estacion.INVIERNO, "Azul",
        List.of(Zona.PIERNAS, Zona.PIES));
    a2.setIsFavorito(false);
    a2.setNivelDeAbrigo(1.0);
    a2.setPuedePonerseEncimaDeOtraPrenda(false);

    // Articulo 3: De otro usuario (debe ser ignorado en los tests de USER_ID)
    Articulo a3 = createArticulo(OTHER_USER_ID, Estilo.FORMAL, Estacion.ENTRETIEMPO, "Verde", List.of(Zona.TORSO));

    articuloRepository.saveAll(List.of(a1, a2, a3));
  }

  private Articulo createArticulo(String userId, Estilo estilo, Estacion estacion, String color, List<Zona> zonas) {
    Articulo a = new Articulo();
    a.setUserId(userId);
    a.setEstilo(estilo);
    a.setEstacion(estacion);
    a.setColorPrimario(color);
    a.setZonasCubiertas(zonas);
    a.setArmario(armarioA); // Armario mockeado para evitar NullPointerException en persistencia
    a.setImageUrl("dummy_url");
    a.setTipo(TipoArticulo.ACCESORIOS);
    a.setColores(List.of(new PorcentajeColor(color, 100)));
    return a;
  }

  @Test
  void getFilteredArticulos_ShouldFilterByUserIdOnly() {
    // Arrange
    FilterRequestDTO filter = new FilterRequestDTO();

    // Act
    List<Articulo> result = articuloService.getFilteredArticulos(filter, USER_ID);

    // Assert
    // Debe retornar a1 y a2, pero no a3
    assertEquals(2, result.size(), "Debe retornar solo los artículos del usuario 'usuario_a'");
    assertTrue(result.stream().allMatch(a -> a.getUserId().equals(USER_ID)));
  }

  @Test
  void getFilteredArticulos_ShouldFilterByEstiloAndEstacion() {
    // Arrange
    FilterRequestDTO filter = new FilterRequestDTO();
    filter.setEstilo(Estilo.CASUAL);
    filter.setEstacion(Estacion.VERANO);

    // Act
    List<Articulo> result = articuloService.getFilteredArticulos(filter, USER_ID);

    // Assert
    assertEquals(1, result.size());
    assertEquals(Estilo.CASUAL, result.get(0).getEstilo());
  }

  @Test
  void getFilteredArticulos_ShouldFilterByZonasCubiertas_MultipleZonesMatch() {
    // Arrange
    FilterRequestDTO filter = new FilterRequestDTO();
    // Filtramos por PIERNAS. Articulo a2 tiene PIERNAS y PIES.
    filter.setZonasCubiertas(List.of(Zona.PIERNAS));

    // Act
    List<Articulo> result = articuloService.getFilteredArticulos(filter, USER_ID);

    // Assert
    // Debe encontrar a2
    assertEquals(1, result.size());
    assertTrue(result.get(0).getZonasCubiertas().contains(Zona.PIERNAS));
  }

  @Test
  void getFilteredArticulos_ShouldFilterByNivelDeAbrigo_GreaterThanOrEqualTo() {
    // Arrange
    FilterRequestDTO filter = new FilterRequestDTO();
    // Articulos: a1 (0.2), a2 (1.0).
    filter.setNivelDeAbrigo(0.8); // Buscar >= 0.8

    // Act
    List<Articulo> result = articuloService.getFilteredArticulos(filter, USER_ID);

    // Assert
    // Debe encontrar solo a2
    assertEquals(1, result.size());
    assertEquals(1.0, result.get(0).getNivelDeAbrigo());
  }
}