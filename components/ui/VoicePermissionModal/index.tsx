'use client'

type Props = {
  isOpen: boolean
  onCancel: () => void
  onConfirm: () => void
}

export default function VoicePermissionModal(props: Props) {
  const { isOpen, onCancel, onConfirm } = props
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-[460px] max-w-[90vw] rounded-2xl border border-white/10 bg-neutral-950/95 p-8 shadow-2xl">
        <div className="mb-5 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#60a5fa"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          </div>
        </div>

        <h2 className="mb-3 text-center font-mono text-sm uppercase tracking-widest text-white">
          Microfone precisa de permissão
        </h2>
        <p className="mb-3 text-center text-sm leading-relaxed text-white/60">
          Pra ativar o controle por voz, o navegador vai pedir acesso ao seu
          microfone.
        </p>
        <p className="mb-6 text-center text-xs leading-relaxed text-white/45">
          Diferente do hand tracking (que roda local), o reconhecimento de voz
          envia áudio pros servidores do navegador (Google no Chrome, Apple no
          Safari) pra transcrição. Nenhum áudio é armazenado pelo projeto.
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
            className="rounded-full bg-blue-500 px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-white transition-colors hover:bg-blue-400"
          >
            Permitir microfone
          </button>
        </div>
      </div>
    </div>
  )
}
