// Componente Button do GasRápido Design System
// Este componente segue as especificações do design system

interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  [key: string]: any // Permitir outras props
}

const Button = (props: ButtonProps) => {
  const { 
    children,
    variant = 'primary', 
    size = 'md', 
    className = '',
    ...rest 
  } = props
  
  // Classes base para o botão
  let classes = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 '
  
  // Variantes do design system
  switch (variant) {
    case 'primary':
      classes += 'bg-primary-500 text-white hover:bg-primary-600 '
      break
    case 'secondary':
      classes += 'bg-accent-400 text-black hover:bg-accent-500 '
      break
    case 'outline':
      classes += 'border border-primary-500 text-primary-500 hover:bg-primary-50 '
      break
    case 'ghost':
      classes += 'text-primary-500 hover:bg-primary-50 '
      break
    default:
      classes += 'bg-primary-500 text-white hover:bg-primary-600 '
  }
  
  // Tamanhos do design system
  switch (size) {
    case 'sm':
      classes += 'h-9 px-3 text-sm '
      break
    case 'md':
      classes += 'h-10 px-4 py-2 '
      break
    case 'lg':
      classes += 'h-11 px-8 text-lg '
      break
    default:
      classes += 'h-10 px-4 py-2 '
  }
  
  // Adicionar classes personalizadas
  classes += className
  
  return (
    <button
      className={classes}
      {...rest}
    >
      {children}
    </button>
  )
}

Button.displayName = 'Button'

export { Button }