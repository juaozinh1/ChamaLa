package br.com.chamala.review;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping
    public ResponseEntity<?> submitReview(@RequestBody @Valid ReviewCreateRequest request) {
        reviewService.submitReview(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", "Avaliação enviada com sucesso!"));
    }
}