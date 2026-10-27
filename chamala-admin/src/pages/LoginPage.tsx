import { useNavigate } from 'react-router-dom'

// Acesso só para contas ADMIN. O login real (JWT) entra na fase 2.
export function LoginPage() {
  const navigate = useNavigate()

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <form
        className="w-full max-w-sm space-y-4 rounded-lg border border-line bg-white p-6"
        onSubmit={(e) => {
          e.preventDefault()
          navigate('/verificacoes')
        }}
      >
        <h1 className="text-xl font-bold text-primary">ChamaLÁ · Administração</h1>
        <label className="block space-y-1">
          <span className="text-sm text-muted">E-mail</span>
          <input type="email" required className="w-full rounded-md border border-line px-3 py-2" />
        </label>
        <label className="block space-y-1">
          <span className="text-sm text-muted">Senha</span>
          <input type="password" required className="w-full rounded-md border border-line px-3 py-2" />
        </label>
        <button type="submit" className="w-full rounded-md bg-primary py-2 font-semibold text-white">
          Entrar
        </button>
      </form>
    </main>
  )
}
