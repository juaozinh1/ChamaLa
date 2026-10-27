package br.com.chamala.category;

public record CategoryResponse(Integer id, String name, String icon, String color) {

    static CategoryResponse from(Category c) {
        return new CategoryResponse(c.getId(), c.getName(), c.getIcon(), c.getColor());
    }
}
