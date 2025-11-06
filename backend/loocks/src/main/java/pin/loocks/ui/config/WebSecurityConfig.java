package pin.loocks.ui.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import pin.loocks.logic.services.AuthService;
import pin.loocks.ui.security.AuthEntryPointJwt;
import pin.loocks.ui.security.AuthTokenFilter;
@Configuration
public class WebSecurityConfig {
    @Autowired
    AuthService userDetailsService;
    @Autowired
    private AuthEntryPointJwt unauthorizedHandler;

    @Bean
    AuthTokenFilter authenticationJwtTokenFilter() {
			return new AuthTokenFilter();
    }

    @Bean
    AuthenticationManager authenticationManager(
			AuthenticationConfiguration authenticationConfiguration
    ) throws Exception {
			return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
   	PasswordEncoder passwordEncoder() {
			return new BCryptPasswordEncoder();
    }

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
			http
				.csrf(csrf -> csrf.disable()) // Disable CSRF
				.cors(cors -> cors.disable()) // Disable CORS (or configure if needed)
				.exceptionHandling(exceptionHandling ->
					exceptionHandling.authenticationEntryPoint(unauthorizedHandler)
				)
				.sessionManagement(sessionManagement ->
					sessionManagement.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
				)
				.authorizeHttpRequests(authorizeRequests ->
					authorizeRequests
						.requestMatchers("/api/auth/check").authenticated()
						.requestMatchers("/api/auth/**", "/swagger-ui/**", "/v3/api-docs/**").permitAll() // Use 'requestMatchers' instead of 'antMatchers'
						.anyRequest().authenticated()
				);

			http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);
			return http.build();
    }
}
