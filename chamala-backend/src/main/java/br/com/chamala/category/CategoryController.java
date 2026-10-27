package br.com.chamala.category;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Primeiro endpoint real: GET /api/v1/categories (telas Home e Categories). */
@RestController
@RequestMapping("/api/v1/categories")
public class CategoryController {

    private final CategoryRepository repository;

    public CategoryController(CategoryRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<CategoryResponse> list() {
        return repository.findAll(Sort.by("id")).stream().map(CategoryResponse::from).toList();
    }
}
