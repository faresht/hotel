package com.tunisiastay;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class TunisiaStayApplication {
    public static void main(String[] args) {
        SpringApplication.run(TunisiaStayApplication.class, args);
    }
}
