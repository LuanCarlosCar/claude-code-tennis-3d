'use client'

type Props = {
  isOpen: boolean
  onCancel: () => void
  onConfirm: () => void
}

export default function CameraPermissionModal(props: Props) {
  const { isOpen, onCancel, onConfirm } = props
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-[420px] max-w-[90vw] rounded-2xl border border-white/10 bg-neutral-950/95 p-8 shadow-2xl">
        <div className="mb-5 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#d4763c"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </div>
        </div>

        <h2 className="mb-3 text-center font-mono text-sm uppercase tracking-widest text-white">
          Câmera precisa de permissão
        </h2>
        <p className="mb-6 text-center text-sm leading-relaxed text-white/60">
          Pra ativar o hand mode, o navegador vai pedir acesso à sua câmera.
          Nada é gravado nem enviado pra servidor — todo o processamento
          acontece localmente no seu navegador.
        </p>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-white/10 px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-white/60 transition-colors hover:bg-white/5 hover:text-white"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-full bg-[#d4763c] px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-white transition-colors hover:bg-[#e08a4f]"
          >
            Permitir câmera
          </button>
        </div>
      </div>
    </div>
  )
}
