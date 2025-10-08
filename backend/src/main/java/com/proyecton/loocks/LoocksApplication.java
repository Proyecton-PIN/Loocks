package com.proyecton.loocks;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
public class LoocksApplication {

	public static void main(String[] args) {
		SpringApplication.run(LoocksApplication.class, args);
	}

}
