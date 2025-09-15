// Componente Card do GasRápido Design System
// Este componente segue as especificações do design system

interface CardProps {
  children: React.ReactNode
  className?: string
  [key: string]: any // Permitir outras props
}

const Card = (props: CardProps) => {
  const { 
    children, 
    className = '', 
    ...rest 
  } = props
  
  // Classes base para o card
  const cardClasses = `rounded-lg border border-gray-200 bg-white text-gray-900 shadow-sm ${className}`
  
  return (
    <div className={cardClasses} {...rest}>
      {children}
    </div>
  )
}

interface CardHeaderProps {
  children: React.ReactNode
  className?: string
  [key: string]: any // Permitir outras props
}

const CardHeader = (props: CardHeaderProps) => {
  const { 
    children, 
    className = '', 
    ...rest 
  } = props
  
  const headerClasses = `p-6 ${className}`
  
  return (
    <div className={headerClasses} {...rest}>
      {children}
    </div>
  )
}

interface CardContentProps {
  children: React.ReactNode
  className?: string
  [key: string]: any // Permitir outras props
}

const CardContent = (props: CardContentProps) => {
  const { 
    children, 
    className = '', 
    ...rest 
  } = props
  
  const contentClasses = `p-6 pt-0 ${className}`
  
  return (
    <div className={contentClasses} {...rest}>
      {children}
    </div>
  )
}

interface CardFooterProps {
  children: React.ReactNode
  className?: string
  [key: string]: any // Permitir outras props
}

const CardFooter = (props: CardFooterProps) => {
  const { 
    children, 
    className = '', 
    ...rest 
  } = props
  
  const footerClasses = `p-6 pt-0 ${className}`
  
  return (
    <div className={footerClasses} {...rest}>
      {children}
    </div>
  )
}

Card.Header = CardHeader
Card.Content = CardContent
Card.Footer = CardFooter

export { Card }