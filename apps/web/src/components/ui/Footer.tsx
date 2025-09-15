// Componente Footer do GasRápido Design System
// Este componente segue as especificações do design system

interface FooterProps {
  children: React.ReactNode
  className?: string
  [key: string]: any // Permitir outras props
}

const Footer = (props: FooterProps) => {
  const { 
    children, 
    className = '', 
    ...rest 
  } = props
  
  // Classes base para o footer
  const footerClasses = `bg-black py-12 ${className}`
  
  return (
    <footer className={footerClasses} {...rest}>
      {children}
    </footer>
  )
}

interface FooterContainerProps {
  children: React.ReactNode
  className?: string
  [key: string]: any // Permitir outras props
}

const FooterContainer = (props: FooterContainerProps) => {
  const { 
    children, 
    className = '', 
    ...rest 
  } = props
  
  const containerClasses = `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`
  
  return (
    <div className={containerClasses} {...rest}>
      {children}
    </div>
  )
}

interface FooterGridProps {
  children: React.ReactNode
  className?: string
  [key: string]: any // Permitir outras props
}

const FooterGrid = (props: FooterGridProps) => {
  const { 
    children, 
    className = '', 
    ...rest 
  } = props
  
  const gridClasses = `grid grid-cols-1 md:grid-cols-4 gap-8 ${className}`
  
  return (
    <div className={gridClasses} {...rest}>
      {children}
    </div>
  )
}

interface FooterColumnProps {
  children: React.ReactNode
  className?: string
  [key: string]: any // Permitir outras props
}

const FooterColumn = (props: FooterColumnProps) => {
  const { 
    children, 
    className = '', 
    ...rest 
  } = props
  
  const columnClasses = `w-full ${className}`
  
  return (
    <div className={columnClasses} {...rest}>
      {children}
    </div>
  )
}

interface FooterTitleProps {
  children: React.ReactNode
  className?: string
  [key: string]: any // Permitir outras props
}

const FooterTitle = (props: FooterTitleProps) => {
  const { 
    children, 
    className = '', 
    ...rest 
  } = props
  
  const titleClasses = `text-lg font-bold text-white ${className}`
  
  return (
    <h3 className={titleClasses} {...rest}>
      {children}
    </h3>
  )
}

interface FooterTextProps {
  children: React.ReactNode
  className?: string
  [key: string]: any // Permitir outras props
}

const FooterText = (props: FooterTextProps) => {
  const { 
    children, 
    className = '', 
    ...rest 
  } = props
  
  const textClasses = `mt-4 text-gray-400 ${className}`
  
  return (
    <p className={textClasses} {...rest}>
      {children}
    </p>
  )
}

Footer.Container = FooterContainer
Footer.Grid = FooterGrid
Footer.Column = FooterColumn
Footer.Title = FooterTitle
Footer.Text = FooterText

export { Footer }