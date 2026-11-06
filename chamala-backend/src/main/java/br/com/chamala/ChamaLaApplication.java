package br.com.chamala;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = "br.com.chamala")
@EntityScan(basePackages = "br.com.chamala")
@EnableJpaRepositories(basePackages = "br.com.chamala")
public class ChamaLaApplication {

    public static void main(String[] args) {
        SpringApplication.run(ChamaLaApplication.class, args);
    }
}