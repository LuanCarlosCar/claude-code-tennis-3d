import HandIcon from '@/components/ui/icons/HandIcon'
import MicIcon from '@/components/ui/icons/MicIcon'
import RotateIcon from '@/components/ui/icons/RotateIcon'

export function VoiceHint() {
  return (
    <span className="flex items-center gap-1.5">
      <MicIcon />
      Diga uma cor: preto · rosa · marrom · original
    </span>
  )
}

export function HandHint() {
  return (
    <span className="flex items-center gap-1.5">
      <HandIcon />
      Mostre a palma. Gire a mão pra rotacionar
    </span>
  )
}

export function DragHint() {
  return (
    <>
      <span className="flex items-center gap-1.5">
        <RotateIcon />
        Arraste
      </span>
      <span>·</span>
      <span>Role pra zoom</span>
    </>
  )
}
