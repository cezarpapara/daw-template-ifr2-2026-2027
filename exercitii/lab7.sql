
INSERT INTO review (author, rating, comment, created_at, product_id)
SELECT v.author, v.rating, v.comment, NOW(), v.product_id
FROM (
    VALUES
    ('Ana Popescu', 5, 'Recomand.', 1),
    ('Mihai Ionescu', 3, NULL, 1),
    ('Elena Radu', 4, 'Laptop bun.', 1),
    ('Andrei Stan', 2, 'Bateria tine putin.', 1),
    ('Maria Dinu', 5, 'Sunet foarte bun.', 2),
    ('Paul Marin', 3, 'Castile sunt acceptabile.', 2)
) AS v(author, rating, comment, product_id)
WHERE NOT EXISTS (
    SELECT 1
    FROM review r
    WHERE r.author = v.author
      AND r.product_id = v.product_id
);

SELECT r.id, r.author, r.rating, r.comment, p.name AS produs
FROM review r
JOIN product p ON p.id = r.product_id
ORDER BY r.id;

SELECT
    p.id,
    p.name AS produs,
    COUNT(r.id) AS numar_recenzii,
    ROUND(AVG(r.rating), 2) AS nota_medie
FROM product p
LEFT JOIN review r ON r.product_id = p.id
GROUP BY p.id, p.name
ORDER BY p.id;
