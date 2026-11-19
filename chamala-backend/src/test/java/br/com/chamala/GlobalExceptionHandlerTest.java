package br.com.chamala;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import br.com.chamala.category.CategoryController;
import br.com.chamala.category.CategoryRepository;
import br.com.chamala.config.SecurityConfig;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

// Camada web isolada (sem banco/Testcontainers): garante que o GlobalExceptionHandler
// preserva o status das exceções do Spring em vez de responder 500 para tudo.
@WebMvcTest(CategoryController.class)
@Import(SecurityConfig.class)
class GlobalExceptionHandlerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private CategoryRepository categoryRepository;

    @Test
    void rotaInexistenteRetorna404() throws Exception {
        mockMvc.perform(get("/api/v1/rota-que-nao-existe"))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.error").value("NoResourceFoundException"));
    }

    @Test
    void metodoNaoSuportadoRetorna405() throws Exception {
        mockMvc.perform(delete("/api/v1/categories"))
            .andExpect(status().isMethodNotAllowed());
    }
}
