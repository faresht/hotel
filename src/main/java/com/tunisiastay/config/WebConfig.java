package com.tunisiastay.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

/**
 * Configuration class for web-related beans.
 */
@Configuration
public class WebConfig {

    /**
     * Creates a RestTemplate bean for making HTTP requests.
     * This is used by the PricePredictionService to communicate with the Ollama API.
     *
     * @return A configured RestTemplate instance
     */
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}