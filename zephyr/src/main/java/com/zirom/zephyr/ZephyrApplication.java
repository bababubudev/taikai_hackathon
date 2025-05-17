package com.zirom.zephyr;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ZephyrApplication {

	public static void main(String[] args) {
		Dotenv dotenv = Dotenv.load();

		// Set to system environment (optional, if Spring should read them)
		System.setProperty("POSTGRES_USER", dotenv.get("POSTGRES_USER"));
		System.setProperty("POSTGRES_PASSWORD", dotenv.get("POSTGRES_PASSWORD"));
		System.setProperty("POSTGRES_DB", dotenv.get("POSTGRES_DB"));
		System.setProperty("DB_PORT", dotenv.get("DB_PORT"));
		System.setProperty("URL", dotenv.get("URL"));

		SpringApplication.run(ZephyrApplication.class, args);
	}

}
