'use client'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center p-6">
          <h2 className="text-2xl font-display mb-4">Une erreur est survenue</h2>
          <p className="text-muted-foreground mb-6">{error?.message ?? 'Erreur inattendue'}</p>
          <button
            className="px-4 py-2 rounded bg-secondary text-secondary-foreground"
            onClick={() => reset()}
          >
            Réessayer
          </button>
        </div>
      </body>
    </html>
  )
}