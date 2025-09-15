// Componente Alert do GasRápido Design System
// Este componente segue as especificações do design system

interface AlertProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'error'
  className?: string
  [key: string]: any // Permitir outras props
}

const Alert = (props: AlertProps) => {
  const { 
    children, 
    variant = 'default',
    className = '', 
    ...rest 
  } = props
  
  // Classes base para o alerta
  let alertClasses = 'rounded-md p-4 '
  
  // Variantes
  switch (variant) {
    case 'success':
      alertClasses += 'bg-green-50 border border-green-200 '
      break
    case 'warning':
      alertClasses += 'bg-yellow-50 border border-yellow-200 '
      break
    case 'error':
      alertClasses += 'bg-red-50 border border-red-200 '
      break
    default:
      alertClasses += 'bg-blue-50 border border-blue-200 '
  }
  
  // Adicionar classes personalizadas
  alertClasses += className
  
  return (
    <div className={alertClasses} {...rest}>
      {children}
    </div>
  )
}

interface AlertTitleProps {
  children: React.ReactNode
  className?: string
  [key: string]: any // Permitir outras props
}

const AlertTitle = (props: AlertTitleProps) => {
  const { 
    children, 
    className = '', 
    ...rest 
  } = props
  
  // Classes base para o título do alerta
  const titleClasses = `text-sm font-medium mb-1 `
  
  // Adicionar classes personalizadas
  const finalClasses = titleClasses + className
  
  return (
    <h5 className={finalClasses} {...rest}>
      {children}
    </h5>
  )
}

interface AlertDescriptionProps {
  children: React.ReactNode
  className?: string
  [key: string]: any // Permitir outras props
}

const AlertDescription = (props: AlertDescriptionProps) => {
  const { 
    children, 
    className = '', 
    ...rest 
  } = props
  
  // Classes base para a descrição do alerta
  const descriptionClasses = `text-sm `
  
  // Adicionar classes personalizadas
  const finalClasses = descriptionClasses + className
  
  return (
    <div className={finalClasses} {...rest}>
      {children}
    </div>
  )
}

Alert.Title = AlertTitle
Alert.Description = AlertDescription

export { Alert }