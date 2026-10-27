#!/usr/bin/env python3
"""Gera .ua/knowledge-graph.json no formato da skill Understand-Anything (/understand).

Uso: python3 build_graph.py <raiz-do-projeto>
Fases seguidas: scan (arquivos, imports) -> análise (símbolos, rotas, endpoints, tabelas)
-> arquitetura (camadas) -> tour -> validação -> salvar.
"""
import json, os, re, subprocess, sys, datetime
from collections import Counter

ROOT = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else '.')
os.chdir(ROOT)

def sh(cmd):
    return subprocess.run(cmd, shell=True, capture_output=True, text=True).stdout.strip()

files = [f for f in sh('git ls-files').splitlines()
         if not re.search(r'(package-lock\.json|\.png$|\.svg$|LICENSE$|^\.vscode/|docs/api/index\.html$)', f)]
commit = sh('git rev-parse --short HEAD') or 'sem-commit'
read = lambda p: open(p, encoding='utf-8', errors='ignore').read()

nodes, edges = {}, []
def node(id, type, name, summary, tags=(), **extra):
    if id not in nodes:
        nodes[id] = {'id': id, 'type': type, 'name': name, 'summary': summary, 'tags': list(tags), **extra}
    return id
def edge(s, t, type, w=0.5):
    edges.append({'source': s, 'target': t, 'type': type, 'weight': w})

# ─── Tecnologias ────────────────────────────────────────────────────────────
TECH = {
 'typescript': ('TypeScript', 'Linguagem: JavaScript com tipos. Usada no app e no painel; o compilador acusa erros antes de rodar.'),
 'react': ('React', 'Biblioteca de interfaces por componentes. Base do app (via React Native) e do painel web.'),
 'react-native': ('React Native', 'Transforma componentes React em telas nativas Android/iOS (View, Text, Pressable).'),
 'expo': ('Expo (SDK 58)', 'Ferramentas em volta do React Native: roda no Expo Go, gera builds na nuvem (EAS) e dá módulos prontos.'),
 'react-navigation': ('React Navigation', 'Rotas do app: pilhas (native-stack) e abas inferiores (bottom-tabs).'),
 'axios': ('Axios', 'Cliente HTTP: faz as chamadas para a API REST.'),
 'secure-store': ('expo-secure-store', 'Guarda dados sensíveis (o token de login) no cofre do aparelho.'),
 'safe-area': ('react-native-safe-area-context', 'Evita que o conteúdo fique sob o notch e a barra do sistema.'),
 'rhf-zod': ('React Hook Form + Zod', 'Formulários e validação de campos. Instalados; entram na fase 2 (login/cadastro).'),
 'vite': ('Vite', 'Servidor de desenvolvimento e empacotador do painel web.'),
 'tailwind': ('Tailwind CSS', 'Estilização por classes utilitárias no painel (bg-primary, rounded-md…).'),
 'react-router': ('React Router', 'Rotas do painel web (/login, /verificacoes, /denuncias…).'),
 'tanstack-query': ('TanStack Query', 'Cache e estados de carregamento das chamadas à API no painel.'),
 'java': ('Java 25', 'Linguagem do backend.'),
 'spring-boot': ('Spring Boot 3.5', 'Framework do backend: sobe o servidor web e liga os componentes por injeção de dependência.'),
 'spring-security': ('Spring Security', 'Controle de acesso: quais rotas são públicas, quais exigem login e papel ADMIN.'),
 'spring-data-jpa': ('Spring Data JPA + Hibernate', 'Mapeia classes Java para tabelas e gera as consultas SQL.'),
 'hibernate-spatial': ('Hibernate Spatial', 'Permite usar colunas geográficas do PostGIS a partir do Java.'),
 'flyway': ('Flyway', 'Aplica as migrações SQL do banco em ordem (V1, V2…) quando a API sobe.'),
 'springdoc': ('springdoc-openapi', 'Gera a página Swagger da API a partir do código.'),
 'postgresql': ('PostgreSQL 16', 'Banco de dados relacional do projeto.'),
 'postgis': ('PostGIS 3.4', 'Extensão do PostgreSQL para geografia: distância e busca por raio.'),
 'docker': ('Docker + Compose', 'Sobe o banco e a API em contêineres com um comando.'),
 'github-actions': ('GitHub Actions', 'CI: roda lint, tipos, build e testes a cada push.'),
 'openapi': ('OpenAPI 3.1', 'Contrato da API: descreve rotas, dados e erros num YAML.'),
 'redocly': ('Redocly CLI', 'Valida o contrato OpenAPI e gera a documentação HTML.'),
 'openapi-typescript': ('openapi-typescript', 'Gera tipos TypeScript a partir do contrato, usados no app e no painel.'),
 'junit-testcontainers': ('JUnit 5 + Testcontainers', 'Testes do backend com um PostGIS real em Docker.'),
 'eslint-prettier': ('ESLint + Prettier', 'Padrão de código do app: erros comuns e formatação.'),
 'oxlint': ('oxlint', 'Linter rápido do painel web.'),
 'maven': ('Maven', 'Baixa as dependências Java e compila o backend (pom.xml).'),
}
for k, (n, s) in TECH.items():
    node(f'service:{k}', 'service', n, s, ['tecnologia'])

SUM = {
 'chamala-mobile/App.tsx': 'Raiz do app: envolve tudo com SafeArea, Sessão e o RootNavigator.',
 'chamala-mobile/index.ts': 'Ponto de entrada do Expo: registra o componente App.',
 'chamala-mobile/app.json': 'Configuração do Expo: nome ChamaLÁ, retrato, pacote br.com.chamala.app, ícones.',
 'chamala-mobile/package.json': 'Dependências do app (Expo 58, React Native 0.88, React Navigation…) e scripts.',
 'chamala-mobile/src/navigation/RootNavigator.tsx': 'Escolhe a navegação pelo papel: sem login → AuthStack, cliente → ClientTabs, profissional → ProTabs.',
 'chamala-mobile/src/navigation/AuthStack.tsx': 'Pilha pública: Welcome, Login, Register, ProRegister.',
 'chamala-mobile/src/navigation/ClientTabs.tsx': 'Abas do cliente (Início, Serviços, Pedidos, Perfil) com pilhas internas.',
 'chamala-mobile/src/navigation/ProTabs.tsx': 'Abas do profissional (Painel, Solicitações, Verificação, Perfil).',
 'chamala-mobile/src/navigation/types.ts': 'Tipos das rotas e parâmetros de cada tela (ex.: CategoryDetail recebe categoryId).',
 'chamala-mobile/src/contexts/SessionContext.tsx': 'Estado global: papel logado, tamanho do texto e alto contraste.',
 'chamala-mobile/src/components/ScreenPlaceholder.tsx': 'Tela provisória reutilizada: título, id do Figma, descrição e botões de navegação.',
 'chamala-mobile/src/screens/shared/AccessibilityScreen.tsx': 'Tela real de acessibilidade: 3 tamanhos de texto e alto contraste.',
 'chamala-mobile/src/services/api.ts': 'Cliente Axios da API com o token do SecureStore no cabeçalho Authorization.',
 'chamala-mobile/src/theme/index.ts': 'Tokens de design do Figma: cores, espaçamentos, raios, tipografia.',
 'chamala-mobile/src/types/domain.ts': 'Tipos de domínio escritos à mão (Role, RequestStatus, CancellationPolicy…).',
 'chamala-mobile/src/types/api.ts': 'Tipos gerados do contrato OpenAPI (não editar à mão).',
 'chamala-admin/src/main.tsx': 'Entrada do painel: React + QueryClient + BrowserRouter.',
 'chamala-admin/src/App.tsx': 'Rotas do painel e layout com menu lateral.',
 'chamala-admin/src/pages/LoginPage.tsx': 'Login do admin (provisório: redireciona para a fila).',
 'chamala-admin/src/pages/Placeholder.tsx': 'Página provisória com título e descrição.',
 'chamala-admin/src/lib/api.ts': 'Cliente Axios do painel (VITE_API_URL).',
 'chamala-admin/src/index.css': 'Tailwind e tokens de cor do protótipo.',
 'chamala-admin/vite.config.ts': 'Vite com plugins React e Tailwind.',
 'chamala-admin/src/types/api.ts': 'Tipos gerados do contrato OpenAPI (não editar à mão).',
 'chamala-backend/pom.xml': 'Dependências Maven do backend e versão do Java.',
 'chamala-backend/Dockerfile': 'Compila com Maven e roda o .jar num JRE (usado no Compose e no Render).',
 'chamala-backend/src/main/java/br/com/chamala/ChamaLaApplication.java': 'Classe principal: inicia o Spring Boot.',
 'chamala-backend/src/main/java/br/com/chamala/config/SecurityConfig.java': 'Regras de acesso: rotas públicas, /admin só ADMIN, resto com login; BCrypt.',
 'chamala-backend/src/main/java/br/com/chamala/category/Category.java': 'Entidade JPA ligada à tabela categories.',
 'chamala-backend/src/main/java/br/com/chamala/category/CategoryRepository.java': 'Repositório Spring Data: consultas à tabela categories sem SQL manual.',
 'chamala-backend/src/main/java/br/com/chamala/category/CategoryResponse.java': 'DTO (record) devolvido em JSON.',
 'chamala-backend/src/main/java/br/com/chamala/category/CategoryController.java': 'Endpoint GET /api/v1/categories.',
 'chamala-backend/src/main/resources/application.yml': 'Configuração: conexão com o banco por variáveis, Flyway, porta, health.',
 'chamala-backend/src/main/resources/db/migration/V1__schema.sql': 'Cria a extensão PostGIS e as 12 tabelas com chaves e CHECKs.',
 'chamala-backend/src/main/resources/db/migration/V2__seed_categories.sql': 'Insere as 8 categorias do Figma.',
 'chamala-backend/src/test/java/br/com/chamala/CategoryApiTest.java': 'Teste de integração: sobe PostGIS, aplica migrações e testa /categories e rota protegida.',
 'chamala-backend/api/openapi.yaml': 'Contrato v1 da API: 44 rotas, 54 operações, schemas e erros.',
 'chamala-backend/api/redocly.yaml': 'Regras do lint do contrato.',
 'docker-compose.yml': 'Sobe o banco PostGIS e a API (build do Dockerfile) ligados.',
 '.github/workflows/ci.yml': 'CI com 4 jobs: contrato, app, painel e backend.',
 'README.md': 'Visão geral, estrutura e como rodar.',
 'docs/ROADMAP.md': 'Resumo das decisões e das 9 fases.',
 'docs/FASE-1.md': 'Entregas da fase 1 e ponto de atenção do CDC.',
}

def area(f):
    if f.startswith('chamala-mobile'): return 'mobile'
    if f.startswith('chamala-admin'): return 'admin'
    if f.startswith('chamala-backend/src/main/resources/db'): return 'banco'
    if f.startswith('chamala-backend/api'): return 'contrato'
    if f.startswith('chamala-backend'): return 'api'
    if f.startswith('docs') or f.endswith('README.md'): return 'docs'
    return 'infra'

CONFIG_RE = re.compile(r'(\.json$|\.ya?ml$|\.config\.(js|ts)$|\.npmrc$|\.prettierrc$|\.gitignore$|Dockerfile$|pom\.xml$|\.env\.example$|tsconfig)')
for f in files:
    t = 'document' if f.endswith('.md') else 'config' if CONFIG_RE.search(f) else 'file'
    if f.endswith('.sql'): t = 'schema'
    tags = [area(f)]
    if f.endswith('types/api.ts'): tags.append('gerado')
    if '/screens/' in f: tags.append('tela')
    try: loc = read(f).count('\n') + 1
    except Exception: loc = 0
    node(f'file:{f}', t, os.path.basename(f), SUM.get(f, f'{os.path.basename(f)} ({area(f)}).'), tags, path=f, loc=loc,
         complexity='simple' if loc < 60 else 'moderate' if loc < 200 else 'complex')

module_edges = set()
for f in files:
    parts = f.split('/')
    for i in range(1, len(parts)):
        d = '/'.join(parts[:i]); parent = '/'.join(parts[:i-1])
        node(f'module:{d}', 'module', parts[i-1] + '/', f'Pasta {d}/', [area(d)], path=d)
        if parent and (parent, d) not in module_edges:
            module_edges.add((parent, d)); edge(f'module:{parent}', f'module:{d}', 'contains', 1.0)
    if len(parts) > 1: edge(f'module:{"/".join(parts[:-1])}', f'file:{f}', 'contains', 1.0)

# ─── TS/TSX ─────────────────────────────────────────────────────────────────
def resolve(src, spec):
    base = os.path.normpath(os.path.join(os.path.dirname(src), spec))
    for ext in ('', '.ts', '.tsx', '/index.ts', '/index.tsx'):
        if base + ext in files: return base + ext
    return None
PKG_TECH = [('react-native-safe-area-context', 'safe-area'), ('@react-navigation', 'react-navigation'), ('expo-secure-store', 'secure-store'),
            ('expo-status-bar', 'expo'), ('expo', 'expo'), ('react-native', 'react-native'), ('axios', 'axios'), ('react-router', 'react-router'),
            ('@tanstack/react-query', 'tanstack-query'), ('react-dom', 'react'), ('react', 'react'), ('@tailwindcss/vite', 'tailwind'),
            ('@vitejs/plugin-react', 'vite'), ('vite', 'vite')]
route_comp = {}
nav_calls = []
for f in files:
    if not re.search(r'\.(ts|tsx)$', f) or f.endswith('types/api.ts'): continue
    src = read(f)
    nodes[f'file:{f}']['tags'].append('typescript')
    edge(f'file:{f}', 'service:typescript', 'depends_on', 0.3)
    for spec in re.findall(r"""import\s+(?:type\s+)?[^'"]*?from\s+['"]([^'"]+)['"]""", src):
        if spec.startswith('.'):
            r = resolve(f, spec)
            if r: edge(f'file:{f}', f'file:{r}', 'imports', 0.7)
        else:
            for p, t in PKG_TECH:
                if spec == p or spec.startswith(p + '/') or spec.startswith(p):
                    edge(f'file:{f}', f'service:{t}', 'depends_on', 0.5); break
    for name in re.findall(r'export\s+(?:default\s+)?function\s+(\w+)', src):
        fid = node(f'function:{f}:{name}', 'function', name,
                   f'{"Tela" if name.endswith("Screen") else "Componente/função"} {name}.', [area(f)] + (['tela'] if name.endswith('Screen') else []), path=f)
        edge(f'file:{f}', fid, 'contains', 1.0)
    for name in re.findall(r'export\s+(?:type|interface)\s+(\w+)', src):
        node(f'class:{f}:{name}', 'class', name, f'Tipo {name}.', [area(f), 'tipo'], path=f); edge(f'file:{f}', f'class:{f}:{name}', 'contains', 1.0)
    for rname, comp in re.findall(r'name="(\w+)"\s*component=\{(\w+)\}', src):
        rid = f'concept:route:{rname}'
        node(rid, 'concept', rname, f'Rota "{rname}" → {comp}.', [area(f), 'rota'], path=f)
        route_comp.setdefault(rname, comp)
        edge(f'file:{f}', rid, 'contains', 0.8)
    for target in re.findall(r"navigate\('(\w+)'", src):
        nav_calls.append((f, target))
comp_file = {n['name']: n['path'] for n in nodes.values() if n['type'] == 'function'}
for rname, comp in route_comp.items():
    if comp in comp_file: edge(f'concept:route:{rname}', f'function:{comp_file[comp]}:{comp}', 'renders', 0.8)
for f, target in nav_calls:
    if f'concept:route:{target}' in nodes: edge(f'file:{f}', f'concept:route:{target}', 'navigates_to', 0.6)
admin_app = 'chamala-admin/src/App.tsx'
if admin_app in files:
    for p in re.findall(r'path="([^"]+)"', read(admin_app)):
        rid = node(f'concept:admin-route:{p}', 'concept', p, f'Rota do painel {p}.', ['admin', 'rota'], path=admin_app)
        edge(f'file:{admin_app}', rid, 'contains', 0.8)

# ─── Java ───────────────────────────────────────────────────────────────────
for f in files:
    if not f.endswith('.java'): continue
    src = read(f)
    edge(f'file:{f}', 'service:java', 'depends_on', 0.3)
    for kw, name in re.findall(r'public\s+(?:final\s+)?(class|interface|record)\s+(\w+)', src):
        cid = node(f'class:{f}:{name}', 'class', name, SUM.get(f, f'{kw} {name}'), [area(f), kw] + (['teste'] if '/test/' in f else []), path=f)
        edge(f'file:{f}', cid, 'contains', 1.0)
    for imp in re.findall(r'import\s+(?:static\s+)?([\w.]+);', src):
        if imp.startswith('br.com.chamala.'):
            cls = imp.split('.')[-1]
            tgt = next((x for x in files if x.endswith(f'/{cls}.java')), None)
            if tgt: edge(f'file:{f}', f'file:{tgt}', 'imports', 0.7)
        elif 'springframework.security' in imp: edge(f'file:{f}', 'service:spring-security', 'depends_on')
        elif 'jakarta.persistence' in imp or 'data.jpa' in imp or 'data.domain' in imp: edge(f'file:{f}', 'service:spring-data-jpa', 'depends_on')
        elif 'testcontainers' in imp or 'junit' in imp: edge(f'file:{f}', 'service:junit-testcontainers', 'depends_on')
        elif 'springframework' in imp: edge(f'file:{f}', 'service:spring-boot', 'depends_on')
    # mesmo pacote: referências por nome de classe
    pkg_dir = os.path.dirname(f)
    for other in files:
        if other != f and other.endswith('.java') and os.path.dirname(other) == pkg_dir:
            cls = os.path.basename(other)[:-5]
            if re.search(rf'\b{cls}\b', src): edge(f'file:{f}', f'file:{other}', 'imports', 0.7)
    base = re.search(r'@RequestMapping\("([^"]+)"\)', src)
    for m, sub in re.findall(r'@(Get|Post|Put|Patch|Delete)Mapping(?:\("([^"]*)"\))?', src):
        path = ((base.group(1) if base else '') + (sub or '')).replace('/api/v1', '')
        edge(f'file:{f}', f'endpoint:{m.upper()} {path}', 'implements', 0.9)
    tm = re.search(r'@Table\(name\s*=\s*"(\w+)"\)', src)
    if tm: edge(f'file:{f}', f'table:{tm.group(1)}', 'maps_to', 0.8)

# ─── OpenAPI ────────────────────────────────────────────────────────────────
oa = 'chamala-backend/api/openapi.yaml'
if oa in files:
    cur = last = None
    for line in read(oa).splitlines():
        m = re.match(r'^  (/[^:]+):\s*$', line)
        if m: cur = m.group(1); continue
        m = re.match(r'^    (get|post|put|patch|delete):\s*$', line)
        if m and cur:
            key = f'{m.group(1).upper()} {cur}'
            last = node(f'endpoint:{key}', 'endpoint', key, '', ['contrato'], path=oa)
            edge(f'file:{oa}', last, 'contains', 1.0); continue
        if last:
            m = re.match(r'^      tags: \[(.+)\]', line)
            if m: nodes[last]['tags'].append(m.group(1))
            m = re.match(r'^      summary: (.+)', line)
            if m and not nodes[last]['summary']: nodes[last]['summary'] = m.group(1).strip("'")
    edge(f'file:{oa}', 'service:openapi', 'depends_on', 0.6)
    edge('service:redocly', f'file:{oa}', 'validates', 0.6)
    for g in ('chamala-mobile/src/types/api.ts', 'chamala-admin/src/types/api.ts'):
        if g in files: edge(f'file:{oa}', f'file:{g}', 'generates', 0.8); edge(f'file:{g}', 'service:openapi-typescript', 'depends_on')
implemented = {e['target'] for e in edges if e['type'] == 'implements'}
for nid, n in nodes.items():
    if n['type'] == 'endpoint':
        n['implemented'] = nid in implemented
        if n['implemented']: n['tags'].append('implementado')

# ─── SQL ────────────────────────────────────────────────────────────────────
v1 = 'chamala-backend/src/main/resources/db/migration/V1__schema.sql'
seed = 'chamala-backend/src/main/resources/db/migration/V2__seed_categories.sql'
if v1 in files:
    sql = read(v1)
    for name, body in re.findall(r'CREATE TABLE (\w+) \((.*?)\n\);', sql, re.S):
        cols = [c.strip().split()[0] for c in body.split('\n') if re.match(r'\s+[a-z_]+\s', c) and not c.strip().startswith(('CHECK', 'PRIMARY'))]
        geo = 'geography' in body
        node(f'table:{name}', 'table', name, f'Tabela {name}: ' + ', '.join(cols), ['banco'] + (['postgis'] if geo else []), columns=cols, path=v1)
        edge(f'file:{v1}', f'table:{name}', 'defines_schema', 1.0)
        for ref in sorted(set(re.findall(r'REFERENCES (\w+)', body))):
            if ref != name: edge(f'table:{name}', f'table:{ref}', 'references', 0.7)
        if geo: edge(f'table:{name}', 'service:postgis', 'depends_on', 0.7)
    edge(f'file:{v1}', 'service:flyway', 'depends_on'); edge(f'file:{v1}', 'service:postgresql', 'depends_on')
if seed in files: edge(f'file:{seed}', 'table:categories', 'writes_to', 0.8); edge(f'file:{seed}', 'service:flyway', 'depends_on')
for nid, n in nodes.items():
    if n['type'] != 'endpoint': continue
    method, p = n['name'].split(' ', 1)
    for kw, tb in [('/categories', 'categories'), ('/review', 'reviews'), ('/contract', 'contracts'), ('/reschedules', 'reschedule_proposals'),
                   ('/admin/reports', 'reports'), ('/reports', 'reports'), ('/admin/verifications', 'verification_documents'),
                   ('/documents', 'verification_documents'), ('/verification', 'verification_documents'), ('/services', 'professional_services'),
                   ('/policy', 'professional_profiles'), ('/availability', 'professional_profiles'), ('/requests', 'service_requests'),
                   ('/professionals', 'professional_profiles'), ('/me/professional', 'professional_profiles'), ('/admin/users', 'users'),
                   ('/auth', 'users'), ('/me', 'users')]:
        if kw in p and f'table:{tb}' in nodes:
            edge(nid, f'table:{tb}', 'reads_from' if method == 'GET' else 'writes_to', 0.5); break

# ─── Configs → tecnologias ──────────────────────────────────────────────────
CFG = {'chamala-mobile/package.json': ['expo', 'react-native', 'react', 'react-navigation', 'axios', 'secure-store', 'safe-area', 'rhf-zod', 'eslint-prettier', 'typescript', 'openapi-typescript'],
       'chamala-mobile/app.json': ['expo'], 'chamala-mobile/eslint.config.js': ['eslint-prettier'], 'chamala-mobile/.prettierrc': ['eslint-prettier'],
       'chamala-admin/package.json': ['react', 'vite', 'tailwind', 'react-router', 'tanstack-query', 'axios', 'oxlint', 'typescript', 'openapi-typescript'],
       'chamala-admin/vite.config.ts': ['vite', 'tailwind'], 'chamala-admin/src/index.css': ['tailwind'], 'chamala-admin/.oxlintrc.json': ['oxlint'],
       'chamala-backend/pom.xml': ['maven', 'java', 'spring-boot', 'spring-security', 'spring-data-jpa', 'hibernate-spatial', 'flyway', 'springdoc', 'postgresql', 'junit-testcontainers'],
       'chamala-backend/Dockerfile': ['docker', 'maven', 'java'], 'docker-compose.yml': ['docker', 'postgis', 'postgresql'],
       'chamala-backend/src/main/resources/application.yml': ['spring-boot', 'flyway', 'postgresql'],
       '.github/workflows/ci.yml': ['github-actions', 'redocly', 'maven', 'eslint-prettier', 'oxlint'], 'chamala-backend/api/redocly.yaml': ['redocly']}
for f, ts in CFG.items():
    if f in files:
        for t in ts: edge(f'file:{f}', f'service:{t}', 'configures', 0.6)
edge('file:docker-compose.yml', 'file:chamala-backend/Dockerfile', 'deploys', 0.8)
edge('file:chamala-backend/src/main/resources/application.yml', f'file:{v1}', 'configures', 0.6)
test = 'chamala-backend/src/test/java/br/com/chamala/CategoryApiTest.java'
edge('file:chamala-backend/src/main/java/br/com/chamala/category/CategoryController.java', f'file:{test}', 'tested_by', 0.8)
edge(f'file:{test}', 'endpoint:GET /categories', 'calls', 0.7)
node('concept:api-rest', 'concept', 'API REST /api/v1', 'Fronteira entre os clientes (app, painel) e o backend: HTTP + JSON, descrita no OpenAPI.', ['contrato'])
edge('concept:api-rest', f'file:{oa}', 'documented_by', 0.8)
for f in ('chamala-mobile/src/services/api.ts', 'chamala-admin/src/lib/api.ts'):
    if f in files: edge(f'file:{f}', 'concept:api-rest', 'calls', 0.7)
edge('concept:api-rest', 'file:chamala-backend/src/main/java/br/com/chamala/category/CategoryController.java', 'calls', 0.6)
edge('file:.github/workflows/ci.yml', f'file:{oa}', 'validates', 0.5)
edge('file:.github/workflows/ci.yml', f'file:{test}', 'calls', 0.5)

# ─── Validação ──────────────────────────────────────────────────────────────
seen = set(); clean = []; dangling = []
for e in edges:
    k = (e['source'], e['target'], e['type'])
    if e['source'] not in nodes or e['target'] not in nodes: dangling.append(k); continue
    if k in seen or e['source'] == e['target']: continue
    seen.add(k); clean.append(e)
edges = clean

# ─── Camadas ────────────────────────────────────────────────────────────────
def layer_of(n):
    if n['type'] == 'service': return 'tecnologias'
    if n['type'] == 'table': return 'banco'
    if n['type'] == 'endpoint' or n['id'] == 'concept:api-rest': return 'contrato'
    return area(n.get('path', ''))
LAYERS = [('mobile', 'App mobile (front)', 'React Native + Expo em chamala-mobile: telas, navegação, sessão, tema.'),
          ('admin', 'Painel admin web (front)', 'React + Vite + Tailwind em chamala-admin: rotas e páginas do administrador.'),
          ('contrato', 'Contrato da API', 'OpenAPI v1: as operações que ligam os fronts ao backend.'),
          ('api', 'API (back)', 'Spring Boot em chamala-backend: segurança, controllers, entidades, testes.'),
          ('banco', 'Banco de dados', 'PostgreSQL + PostGIS: migrações Flyway, 12 tabelas e seed.'),
          ('infra', 'Infra e CI', 'Docker Compose, GitHub Actions e configurações da raiz.'),
          ('docs', 'Documentação', 'README, roadmap e fase 1.'),
          ('tecnologias', 'Tecnologias', 'Bibliotecas, frameworks e ferramentas usadas, ligadas aos arquivos que as usam.')]
for n in nodes.values(): n['layer'] = f'layer:{layer_of(n)}'
layers = [{'id': f'layer:{k}', 'name': nm, 'description': d, 'nodeIds': [i for i, x in nodes.items() if x['layer'] == f'layer:{k}']} for k, nm, d in LAYERS]

def ids(*xs): return [x for x in xs if x in nodes]
tour = [
 {'order': 1, 'title': 'Visão geral', 'description': 'Três partes conversam por HTTP: app mobile e painel web chamam a API, que é a única a acessar o banco.', 'nodeIds': ids('file:README.md', 'file:docker-compose.yml', 'concept:api-rest')},
 {'order': 2, 'title': 'Como o app começa', 'description': 'index.ts registra App.tsx, que monta a sessão e o RootNavigator.', 'nodeIds': ids('file:chamala-mobile/index.ts', 'file:chamala-mobile/App.tsx', 'file:chamala-mobile/src/navigation/RootNavigator.tsx')},
 {'order': 3, 'title': 'Navegação por papel', 'description': 'O papel da sessão decide entre AuthStack, ClientTabs e ProTabs; cada rota aponta para uma tela do Figma.', 'nodeIds': ids('file:chamala-mobile/src/contexts/SessionContext.tsx', 'file:chamala-mobile/src/navigation/AuthStack.tsx', 'file:chamala-mobile/src/navigation/ClientTabs.tsx', 'file:chamala-mobile/src/navigation/ProTabs.tsx')},
 {'order': 4, 'title': 'Telas e tema', 'description': 'As telas usam ScreenPlaceholder e os tokens do tema; Acessibilidade já é uma tela real.', 'nodeIds': ids('file:chamala-mobile/src/components/ScreenPlaceholder.tsx', 'file:chamala-mobile/src/theme/index.ts', 'file:chamala-mobile/src/screens/shared/AccessibilityScreen.tsx')},
 {'order': 5, 'title': 'Painel admin', 'description': 'main.tsx liga React Query e o roteador; App.tsx define as rotas e o menu.', 'nodeIds': ids('file:chamala-admin/src/main.tsx', 'file:chamala-admin/src/App.tsx', 'file:chamala-admin/src/pages/LoginPage.tsx')},
 {'order': 6, 'title': 'O contrato', 'description': 'openapi.yaml descreve todas as rotas; dele saem os tipos TypeScript dos dois fronts.', 'nodeIds': ids(f'file:{oa}', 'file:chamala-mobile/src/types/api.ts', 'file:chamala-admin/src/types/api.ts')},
 {'order': 7, 'title': 'Uma requisição de ponta a ponta', 'description': 'GET /categories: SecurityConfig libera, CategoryController chama o repositório, o JPA lê a tabela categories.', 'nodeIds': ids('file:chamala-backend/src/main/java/br/com/chamala/config/SecurityConfig.java', 'file:chamala-backend/src/main/java/br/com/chamala/category/CategoryController.java', 'file:chamala-backend/src/main/java/br/com/chamala/category/CategoryRepository.java', 'table:categories')},
 {'order': 8, 'title': 'O banco', 'description': 'O Flyway roda V1 (tabelas) e V2 (categorias) ao subir a API; PostGIS guarda a localização.', 'nodeIds': ids(f'file:{v1}', f'file:{seed}', 'table:professional_profiles', 'table:service_requests', 'table:contracts')},
 {'order': 9, 'title': 'Rodar e testar', 'description': 'Docker Compose sobe banco e API; o teste sobe um PostGIS real; o CI repete tudo no GitHub.', 'nodeIds': ids('file:docker-compose.yml', 'file:chamala-backend/Dockerfile', f'file:{test}', 'file:.github/workflows/ci.yml')},
]

graph = {'version': '1.0.0',
         'project': {'name': 'ChamaLÁ', 'languages': ['TypeScript', 'Java', 'SQL', 'YAML'],
                     'frameworks': ['React Native', 'Expo', 'React', 'Vite', 'Spring Boot', 'PostgreSQL/PostGIS'],
                     'description': 'App mobile que conecta clientes a profissionais de serviços residenciais, com painel admin web e API Spring Boot.',
                     'analyzedAt': datetime.datetime.now(datetime.timezone.utc).isoformat(timespec='seconds'), 'gitCommitHash': commit},
         'nodes': list(nodes.values()), 'edges': edges, 'layers': layers, 'tour': tour}
os.makedirs('.ua', exist_ok=True)
json.dump(graph, open('.ua/knowledge-graph.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
json.dump({'lastAnalyzedAt': graph['project']['analyzedAt'], 'gitCommitHash': commit, 'version': '1.0.0', 'analyzedFiles': len(files)},
          open('.ua/meta.json', 'w', encoding='utf-8'), indent=1)
print(json.dumps({'files': len(files), 'nodes': len(nodes), 'edges': len(edges), 'dangling': dangling[:10], 'danglingCount': len(dangling),
                  'nodeTypes': Counter(n['type'] for n in nodes.values()), 'edgeTypes': Counter(e['type'] for e in edges),
                  'layers': {l['id']: len(l['nodeIds']) for l in layers}, 'tour': len(tour),
                  'endpoints': sum(1 for n in nodes.values() if n['type'] == 'endpoint'),
                  'implemented': [n['id'] for n in nodes.values() if n.get('implemented')]}, ensure_ascii=False))
