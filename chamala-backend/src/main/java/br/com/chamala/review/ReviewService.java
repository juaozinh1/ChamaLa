package br.com.chamala.review;

import br.com.chamala.order.Order;
import br.com.chamala.order.OrderRepository;
import br.com.chamala.order.OrderStatus;
import br.com.chamala.user.User;
import br.com.chamala.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    public ReviewService(ReviewRepository reviewRepository,
                         OrderRepository orderRepository,
                         UserRepository userRepository) {
        this.reviewRepository = reviewRepository;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public void submitReview(ReviewCreateRequest request) {
        Order order = orderRepository.findById(request.orderId())
                .orElseThrow(() -> new IllegalArgumentException("Pedido não encontrado."));

        if (order.getStatus() != OrderStatus.COMPLETED) {
            throw new IllegalStateException("Apenas pedidos finalizados (COMPLETED) podem ser avaliados.");
        }

        if (reviewRepository.existsByOrderId(order.getId())) {
            throw new IllegalStateException("Este pedido já foi avaliado.");
        }

        User client = userRepository.findById(request.clientId())
                .orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado."));

        if (!order.getClient().getId().equals(client.getId())) {
            throw new IllegalArgumentException("Apenas o cliente contratante pode avaliar este serviço.");
        }

        User professional = order.getProfessional();
        if (professional == null) {
            throw new IllegalStateException("Este chamado não possui um profissional atribuído.");
        }

        // 1. Salva a avaliação
        Review review = new Review(order, client, professional, request.rating(), request.comment());
        reviewRepository.save(review);

        // 2. Recalcula e atualiza a média do profissional
        Double media = reviewRepository.calculateAverageRating(professional.getId());
        long total = reviewRepository.countByProfessionalId(professional.getId());

        professional.setRating(media != null ? Math.round(media * 100.0) / 100.0 : 0.0);
        professional.setReviewCount((int) total);
        userRepository.save(professional);
    }
}