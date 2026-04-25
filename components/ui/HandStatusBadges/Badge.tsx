type Props = {
  active: boolean
  colorClass: string
  children: React.ReactNode
}

export default function Badge(props: Props) {
  const { active, colorClass, children } = props
  return (
    <div
      className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest backdrop-blur-md transition-opacity duration-200 ${
        active
          ? 'border-white/20 bg-white/10 text-white'
          : 'border-white/10 bg-white/5 text-white/40'
      }`}
    >
      <span
        className={`block h-1.5 w-1.5 rounded-full ${
          active ? `${colorClass} animate-pulse shadow-[0_0_8px]` : 'bg-white/20'
        }`}
      />
      {children}
    </div>
  )
}
