INSERT INTO users (id, name, email, password_hash, role) VALUES
 ('00000000-0000-0000-0000-000000000001','Carlos Eletricista','carlos@teste.com','hash-fake','PROFESSIONAL'),
 ('00000000-0000-0000-0000-000000000002','Maria Faxineira','maria@teste.com','hash-fake','PROFESSIONAL'),
 ('00000000-0000-0000-0000-000000000003','José Encanador','jose@teste.com','hash-fake','PROFESSIONAL'),
 ('00000000-0000-0000-0000-000000000004','Ana Pintora','ana@teste.com','hash-fake','PROFESSIONAL'),
 ('00000000-0000-0000-0000-000000000005','Pedro Jardineiro','pedro@teste.com','hash-fake','PROFESSIONAL');

-- ST_MakePoint(longitude, latitude)
INSERT INTO professional_profiles
  (user_id, bio, base_location, neighborhood, city, available, verification_status, rating_avg, rating_count) VALUES
 ('00000000-0000-0000-0000-000000000001','Eletricista residencial', ST_MakePoint(-34.9783,-8.0206)::geography,'Centro','Camaragibe',true,'APPROVED',4.8,25),
 ('00000000-0000-0000-0000-000000000002','Limpeza geral',           ST_MakePoint(-34.8770,-8.0476)::geography,'Santo Antônio','Recife',true,'APPROVED',4.5,12),
 ('00000000-0000-0000-0000-000000000003','Reparos hidráulicos',     ST_MakePoint(-34.9000,-8.1200)::geography,'Boa Viagem','Recife',true,'APPROVED',4.2,8),
 ('00000000-0000-0000-0000-000000000004','Pintura e acabamento',    ST_MakePoint(-34.8553,-8.0089)::geography,'Carmo','Olinda',true,'APPROVED',4.9,31),
 ('00000000-0000-0000-0000-000000000005','Jardins e podas',         ST_MakePoint(-35.0147,-8.1130)::geography,'Candeias','Jaboatão',true,'APPROVED',4.0,5);

INSERT INTO professional_categories (professional_id, category_id, is_primary) VALUES
 ('00000000-0000-0000-0000-000000000001',2,true),
 ('00000000-0000-0000-0000-000000000002',1,true),
 ('00000000-0000-0000-0000-000000000003',3,true),
 ('00000000-0000-0000-0000-000000000004',4,true),
 ('00000000-0000-0000-0000-000000000005',6,true);

INSERT INTO professional_services (id, professional_id, category_id, title, price_cents) VALUES
 (gen_random_uuid(),'00000000-0000-0000-0000-000000000001',2,'Troca de tomadas e interruptores',8000),
 (gen_random_uuid(),'00000000-0000-0000-0000-000000000002',1,'Limpeza completa (apartamento)',15000),
 (gen_random_uuid(),'00000000-0000-0000-0000-000000000003',3,'Conserto de vazamento',12000);