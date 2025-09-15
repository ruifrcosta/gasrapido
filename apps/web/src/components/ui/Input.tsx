// Componente Input do GasRápido Design System
// Este componente segue as especificações do design system

interface InputProps {
  label?: string
  error?: string
  helperText?: string
  className?: string
  [key: string]: any // Permitir outras props
}

const Input = (props: InputProps) => {
  const { 
    label, 
    error, 
    helperText, 
    className = '', 
    ...rest 
  } = props
  
  // Classes base para o input
  let inputClasses = 'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
  
  // Adicionar classe de erro se houver
  if (error) {
    inputClasses += ' border-error-500'
  }
  
  // Adicionar classes personalizadas
  if (className) {
    inputClasses += ` ${className}`
  }
  
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        className={inputClasses}
        {...rest}
      />
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
      {error && (
        <p className="mt-1 text-sm text-error-500">{error}</p>
      )}
    </div>
  )
}

Input.displayName = 'Input'

export { Input }