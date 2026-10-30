-- Busca por proximidade: profissionais num raio de 10 km de um cliente em Camaragibe
-- ST_MakePoint(longitude, latitude)
SELECT u.name, pp.neighborhood, pp.city,
       round((ST_Distance(pp.base_location, ST_MakePoint(-34.9783,-8.0206)::geography)/1000)::numeric, 1) AS km
FROM professional_profiles pp
JOIN users u ON u.id = pp.user_id
WHERE pp.verification_status = 'APPROVED'
  AND pp.available
  AND ST_DWithin(pp.base_location, ST_MakePoint(-34.9783,-8.0206)::geography, 10000)
ORDER BY km;