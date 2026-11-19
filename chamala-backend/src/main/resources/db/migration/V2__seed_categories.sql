-- Categorias iniciais, iguais às do Supabase. "icon" é o nome do ícone Ionicons usado no app.
INSERT INTO categories (id, name, icon, color) VALUES
    (1, 'Geral',            'construct-outline',     '#2563EB'),
    (2, 'Limpeza e Faxina', 'sparkles-outline',      '#10B981'),
    (3, 'Eletricista',      'flash-outline',         '#F59E0B'),
    (4, 'Encanador',        'water-outline',         '#06B6D4'),
    (5, 'Pintura',          'color-palette-outline', '#8B5CF6');

SELECT setval('categories_id_seq', (SELECT max(id) FROM categories));
