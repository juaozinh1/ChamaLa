interface Props {
  title: string
  description: string
}

// Página provisória até a fase 7 do roadmap (confiança e painel web).
export function Placeholder({ title, description }: Props) {
  return (
    <section className="space-y-2">
      <h1 className="text-2xl font-bold text-primary">{title}</h1>
      <p className="text-muted">{description}</p>
    </section>
  )
}
