// Componente Form do GasRápido Design System
// Este componente segue as especificações do design system

interface FormProps {
  children: React.ReactNode
  className?: string
  [key: string]: any // Permitir outras props
}

const Form = (props: FormProps) => {
  const { 
    children, 
    className = '', 
    ...rest 
  } = props
  
  // Classes base para o formulário
  const formClasses = `space-y-6 ${className}`
  
  return (
    <form className={formClasses} {...rest}>
      {children}
    </form>
  )
}

interface FormFieldProps {
  children: React.ReactNode
  className?: string
  [key: string]: any // Permitir outras props
}

const FormField = (props: FormFieldProps) => {
  const { 
    children, 
    className = '', 
    ...rest 
  } = props
  
  const fieldClasses = `grid grid-cols-1 md:grid-cols-2 gap-6 ${className}`
  
  return (
    <div className={fieldClasses} {...rest}>
      {children}
    </div>
  )
}

interface FormItemProps {
  children: React.ReactNode
  className?: string
  [key: string]: any // Permitir outras props
}

const FormItem = (props: FormItemProps) => {
  const { 
    children, 
    className = '', 
    ...rest 
  } = props
  
  const itemClasses = `w-full ${className}`
  
  return (
    <div className={itemClasses} {...rest}>
      {children}
    </div>
  )
}

interface FormLabelProps {
  children: React.ReactNode
  className?: string
  [key: string]: any // Permitir outras props
}

const FormLabel = (props: FormLabelProps) => {
  const { 
    children, 
    className = '', 
    ...rest 
  } = props
  
  const labelClasses = `block text-sm font-medium text-gray-700 mb-1 ${className}`
  
  return (
    <label className={labelClasses} {...rest}>
      {children}
    </label>
  )
}

interface FormMessageProps {
  children: React.ReactNode
  className?: string
  error?: boolean
  [key: string]: any // Permitir outras props
}

const FormMessage = (props: FormMessageProps) => {
  const { 
    children, 
    className = '', 
    error = false,
    ...rest 
  } = props
  
  const messageClasses = `mt-1 text-sm ${error ? 'text-error-500' : 'text-gray-500'} ${className}`
  
  return (
    <p className={messageClasses} {...rest}>
      {children}
    </p>
  )
}

Form.Field = FormField
Form.Item = FormItem
Form.Label = FormLabel
Form.Message = FormMessage

export { Form }