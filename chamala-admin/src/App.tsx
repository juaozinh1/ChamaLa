import { NavLink, Navigate, Outlet, Route, Routes, useParams } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { Placeholder } from './pages/Placeholder'

const MENU = [
  { to: '/verificacoes', label: 'Verificações' },
  { to: '/denuncias', label: 'Denúncias' },
]

function Layout() {
  return (
    <div className="flex min-h-screen">
      <aside className="w-56 shrink-0 border-r border-line bg-white p-4">
        <p className="mb-6 text-lg font-bold text-primary">ChamaLÁ Admin</p>
        <nav className="space-y-1">
          {MENU.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `block rounded-md px-3 py-2 ${isActive ? 'bg-primary text-white' : 'text-muted hover:bg-cream'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  )
}

function WithId({ title, description }: { title: string; description: string }) {
  const { id } = useParams()
  return <Placeholder title={`${title} ${id ?? ''}`} description={description} />
}

// Rotas do painel definidas no roadmap.
export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<Layout />}>
        <Route
          path="/verificacoes"
          element={<Placeholder title="Fila de verificação" description="Profissionais com documentos pendentes." />}
        />
        <Route
          path="/verificacoes/:id"
          element={<WithId title="Análise" description="Selfie e documentos por URL assinada; aprovar ou recusar com motivo." />}
        />
        <Route
          path="/denuncias"
          element={<Placeholder title="Denúncias" description="Lista por status; resolver ou arquivar." />}
        />
        <Route
          path="/usuarios/:id"
          element={<WithId title="Usuário" description="Pedidos, avaliações e denúncias; suspender ou reativar." />}
        />
        <Route
          path="/pedidos/:id"
          element={<WithId title="Pedido" description="Contrato, cancelamentos e multas registradas." />}
        />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
