// Componente Table do GasRápido Design System
// Este componente segue as especificações do design system

interface TableProps {
  children: React.ReactNode
  className?: string
  [key: string]: any // Permitir outras props
}

const Table = (props: TableProps) => {
  const { 
    children, 
    className = '', 
    ...rest 
  } = props
  
  // Classes base para a tabela
  const tableClasses = `min-w-full divide-y divide-gray-200 ${className}`
  
  return (
    <div className="overflow-x-auto">
      <table className={tableClasses} {...rest}>
        {children}
      </table>
    </div>
  )
}

interface TableHeadProps {
  children: React.ReactNode
  className?: string
  [key: string]: any // Permitir outras props
}

const TableHead = (props: TableHeadProps) => {
  const { 
    children, 
    className = '', 
    ...rest 
  } = props
  
  const headClasses = `bg-gray-50 ${className}`
  
  return (
    <thead className={headClasses} {...rest}>
      {children}
    </thead>
  )
}

interface TableBodyProps {
  children: React.ReactNode
  className?: string
  [key: string]: any // Permitir outras props
}

const TableBody = (props: TableBodyProps) => {
  const { 
    children, 
    className = '', 
    ...rest 
  } = props
  
  const bodyClasses = `bg-white divide-y divide-gray-200 ${className}`
  
  return (
    <tbody className={bodyClasses} {...rest}>
      {children}
    </tbody>
  )
}

interface TableRowProps {
  children: React.ReactNode
  className?: string
  [key: string]: any // Permitir outras props
}

const TableRow = (props: TableRowProps) => {
  const { 
    children, 
    className = '', 
    ...rest 
  } = props
  
  const rowClasses = `hover:bg-gray-50 ${className}`
  
  return (
    <tr className={rowClasses} {...rest}>
      {children}
    </tr>
  )
}

interface TableHeaderProps {
  children: React.ReactNode
  className?: string
  [key: string]: any // Permitir outras props
}

const TableHeader = (props: TableHeaderProps) => {
  const { 
    children, 
    className = '', 
    ...rest 
  } = props
  
  const headerClasses = `px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`
  
  return (
    <th className={headerClasses} {...rest}>
      {children}
    </th>
  )
}

interface TableCellProps {
  children: React.ReactNode
  className?: string
  [key: string]: any // Permitir outras props
}

const TableCell = (props: TableCellProps) => {
  const { 
    children, 
    className = '', 
    ...rest 
  } = props
  
  const cellClasses = `px-6 py-4 whitespace-nowrap text-sm text-gray-500 ${className}`
  
  return (
    <td className={cellClasses} {...rest}>
      {children}
    </td>
  )
}

Table.Head = TableHead
Table.Body = TableBody
Table.Row = TableRow
Table.Header = TableHeader
Table.Cell = TableCell

export { Table }