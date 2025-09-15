// Componente Navbar do GasRápido Design System
// Este componente segue as especificações do design system

interface NavbarProps {
  children: React.ReactNode
  className?: string
  [key: string]: any // Permitir outras props
}

const Navbar = (props: NavbarProps) => {
  const { 
    children, 
    className = '', 
    ...rest 
  } = props
  
  // Classes base para a navbar
  const navbarClasses = `bg-white shadow-sm border-b border-gray-200 ${className}`
  
  return (
    <nav className={navbarClasses} {...rest}>
      {children}
    </nav>
  )
}

interface NavbarContainerProps {
  children: React.ReactNode
  className?: string
  [key: string]: any // Permitir outras props
}

const NavbarContainer = (props: NavbarContainerProps) => {
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

interface NavbarContentProps {
  children: React.ReactNode
  className?: string
  [key: string]: any // Permitir outras props
}

const NavbarContent = (props: NavbarContentProps) => {
  const { 
    children, 
    className = '', 
    ...rest 
  } = props
  
  const contentClasses = `flex justify-between items-center h-16 ${className}`
  
  return (
    <div className={contentClasses} {...rest}>
      {children}
    </div>
  )
}

interface NavbarBrandProps {
  children: React.ReactNode
  className?: string
  [key: string]: any // Permitir outras props
}

const NavbarBrand = (props: NavbarBrandProps) => {
  const { 
    children, 
    className = '', 
    ...rest 
  } = props
  
  const brandClasses = `flex items-center ${className}`
  
  return (
    <div className={brandClasses} {...rest}>
      {children}
    </div>
  )
}

interface NavbarNavProps {
  children: React.ReactNode
  className?: string
  [key: string]: any // Permitir outras props
}

const NavbarNav = (props: NavbarNavProps) => {
  const { 
    children, 
    className = '', 
    ...rest 
  } = props
  
  const navClasses = `hidden md:block ml-10 ${className}`
  
  return (
    <div className={navClasses} {...rest}>
      {children}
    </div>
  )
}

interface NavbarNavItemProps {
  children: React.ReactNode
  active?: boolean
  className?: string
  [key: string]: any // Permitir outras props
}

const NavbarNavItem = (props: NavbarNavItemProps) => {
  const { 
    children, 
    active = false,
    className = '', 
    ...rest 
  } = props
  
  const itemClasses = `px-3 py-2 rounded-md text-sm font-medium ${
    active 
      ? 'bg-primary-50 text-primary-600' 
      : 'text-gray-500 hover:text-gray-700'
  } ${className}`
  
  return (
    <a className={itemClasses} {...rest}>
      {children}
    </a>
  )
}

interface NavbarActionsProps {
  children: React.ReactNode
  className?: string
  [key: string]: any // Permitir outras props
}

const NavbarActions = (props: NavbarActionsProps) => {
  const { 
    children, 
    className = '', 
    ...rest 
  } = props
  
  const actionsClasses = `flex items-center ${className}`
  
  return (
    <div className={actionsClasses} {...rest}>
      {children}
    </div>
  )
}

Navbar.Container = NavbarContainer
Navbar.Content = NavbarContent
Navbar.Brand = NavbarBrand
Navbar.Nav = NavbarNav
Navbar.NavItem = NavbarNavItem
Navbar.Actions = NavbarActions

export { Navbar }