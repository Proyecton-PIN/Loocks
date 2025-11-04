package pin.loocks.ui.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.security.SecurityScheme.In;
import io.swagger.v3.oas.models.security.SecurityScheme.Type;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
      final String securitySchemeName = "bearerAuth";

      return new OpenAPI()
        .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
        .components(new io.swagger.v3.oas.models.Components()
          .addSecuritySchemes(securitySchemeName,
            new SecurityScheme()
              .name(securitySchemeName)
              .type(Type.HTTP)
              .scheme("bearer")
              .bearerFormat("JWT")
              .in(In.HEADER)))
        .info(new Info()
          .title("Mi API con JWT")
          .version("1.0")
          .description("Documentación de la API protegida con Bearer Token"));
    }
}
