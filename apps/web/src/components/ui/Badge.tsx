// Componente Badge do GasRápido Design System
// Este componente segue as especificações do design system

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  className?: string
  [key: string]: any // Permitir outras props
}

const Badge = (props: BadgeProps) => {
  const { 
    children, 
    variant = 'default',
    className = '', 
    ...rest 
  } = props
  
  // Classes base para o badge
  let badgeClasses = 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 '
  
  // Variantes
  switch (variant) {
    case 'default':
      badgeClasses += 'border-transparent bg-primary-500 text-white '
      break
    case 'secondary':
      badgeClasses += 'border-transparent bg-accent-400 text-black '
      break
    case 'destructive':
      badgeClasses += 'border-transparent bg-error-500 text-white '
      break
    case 'outline':
      badgeClasses += 'text-gray-900 border-gray-200 '
      break
    default:
      badgeClasses += 'border-transparent bg-primary-500 text-white '
  }
  
  // Adicionar classes personalizadas
  badgeClasses += className
  
  return (
    <div className={badgeClasses} {...rest}>
      {children}
    </div>
  )
}

export { Badge }