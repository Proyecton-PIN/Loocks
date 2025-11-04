package pin.loocks.ui.loggers;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class StartupLogger implements CommandLineRunner {

    @Override
    public void run(String... args) {
        String port = System.getProperty("server.port", "8080");
        String contextPath = System.getProperty("server.servlet.context-path", "");
        if (contextPath.equals("/")) contextPath = "";

        System.out.println("\n----------------------------------------------------------");
        System.out.println("Swagger UI disponible en:");
        System.out.println("http://localhost:" + port + contextPath + "/swagger-ui/index.html");
        System.out.println("OpenAPI JSON:");
        System.out.println("http://localhost:" + port + contextPath + "/v3/api-docs");
        System.out.println("----------------------------------------------------------\n");
    }
}
