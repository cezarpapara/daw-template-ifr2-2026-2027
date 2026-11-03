-- Laboratorul 07: interogari pentru DBeaver
-- Rulati cate o interogare: cursorul pe ea si Ctrl + Enter.

-- 1. Produsele existente: notati id-urile
SELECT id, name FROM product ORDER BY id;

-- 2. Doua recenzii pentru primul produs (ca in laborator)
--    (SELECT MIN(id) FROM product) = id-ul primului produs, ca sa nu-l scrieti de mana
INSERT INTO review (author, rating, comment, created_at, product_id)
VALUES ('Ana Popescu', 5, 'Foarte mulțumită, recomand.', NOW(), (SELECT MIN(id) FROM product)),
       ('Mihai Ionescu', 3, NULL, NOW(), (SELECT MIN(id) FROM product));

-- 3. Recenziile, cu numele produsului alaturi (JOIN pe cheia straina)
SELECT r.id, r.author, r.rating, r.comment, p.name AS produs
FROM review r
JOIN product p ON p.id = r.product_id
ORDER BY r.id;

-- Exercitiul 1: inca patru recenzii, pentru doua produse diferite, cu note diferite
INSERT INTO review (author, rating, comment, created_at, product_id)
VALUES ('Elena Dumitru', 4, 'Funcționează bine, montaj ușor.', NOW(), (SELECT MIN(id) FROM product)),
       ('Andrei Matei', 2, 'Instrucțiunile sunt incomplete.', NOW(), (SELECT MAX(id) FROM product)),
       ('Ioana Stan', 5, 'Exact ce aveam nevoie pentru robot.', NOW(), (SELECT MAX(id) FROM product)),
       ('Radu Ciobanu', 4, NULL, NOW(), (SELECT MAX(id) FROM product));

-- Exercitiul 2: pentru fiecare produs, numarul de recenzii si nota medie
-- LEFT JOIN pastreaza si produsele FARA recenzii (cu 0 recenzii si media NULL);
-- un JOIN simplu le-ar elimina din rezultat.
SELECT p.id,
       p.name AS produs,
       COUNT(r.id) AS numar_recenzii,
       ROUND(AVG(r.rating), 2) AS nota_medie
FROM product p
LEFT JOIN review r ON r.product_id = p.id
GROUP BY p.id, p.name
ORDER BY p.id;

-- Exercitiul 3 (optional): recenzie pentru un produs inexistent.
-- Rezultat: EROARE "violates foreign key constraint" - o produce constrangerea
-- FOREIGN KEY (cheia straina) din PostgreSQL, nu aplicatia.
INSERT INTO review (author, rating, comment, created_at, product_id)
VALUES ('Test', 5, NULL, NOW(), 9999);
