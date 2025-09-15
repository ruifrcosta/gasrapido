// Design System do GasRápido
// Cores
export const colors = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#1F3A93',
    600: '#1a3076',
    700: '#162659',
    800: '#111d3f',
    900: '#0d1426',
  },
  accent: {
    50: '#fffbeb',
    100: '#fef3c7',
    400: '#FFB400',
    500: '#f59e0b',
    600: '#d97706',
  },
  neutral: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    500: '#22c55e',
    600: '#16a34a',
  },
  warning: {
    50: '#fff7ed',
    100: '#ffedd5',
    500: '#f97316',
    600: '#ea580c',
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    500: '#ef4444',
    600: '#dc2626',
  },
}

// Tipografia
export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    heading: ['Inter', 'system-ui', 'sans-serif'],
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1.0rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3.0rem',
    '6xl': '3.75rem',
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  lineHeight: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
}

// Espaçamento
export const spacing = {
  px: '1px',
  0: '0',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  32: '8rem',
  40: '10rem',
  48: '12rem',
  56: '14rem',
  64: '16rem',
}

// Bordas
export const borders = {
  radius: {
    none: '0',
    sm: '0.125rem',
    md: '0.25rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },
  width: {
    0: '0',
    1: '1px',
    2: '2px',
    4: '4px',
    8: '8px',
  },
}

// Sombras
export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  none: 'none',
}

// Breakpoints para responsividade
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
}

// Componentes
export const components = {
  button: {
    base: 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    variants: {
      primary: 'bg-primary-500 text-white hover:bg-primary-600',
      secondary: 'bg-accent-400 text-black hover:bg-accent-500',
      outline: 'border border-primary-500 text-primary-500 hover:bg-primary-50',
      ghost: 'text-primary-500 hover:bg-primary-50',
    },
    sizes: {
      sm: 'h-9 px-3 text-sm',
      md: 'h-10 px-4 py-2',
      lg: 'h-11 px-8 text-lg',
    },
  },
  input: {
    base: 'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
    variants: {
      default: 'border-gray-300',
      error: 'border-error-500',
    },
  },
  card: {
    base: 'rounded-lg border border-gray-200 bg-white text-gray-900 shadow-sm',
  },
  badge: {
    base: 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
    variants: {
      default: 'border-transparent bg-primary-500 text-white',
      secondary: 'border-transparent bg-accent-400 text-black',
      destructive: 'border-transparent bg-error-500 text-white',
      outline: 'text-gray-900 border-gray-200',
    },
  },
  navbar: {
    base: 'bg-white shadow-sm border-b border-gray-200',
    container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    content: 'flex justify-between items-center h-16',
    brand: 'flex items-center',
    nav: 'hidden md:block ml-10',
    navItem: {
      base: 'px-3 py-2 rounded-md text-sm font-medium',
      active: 'bg-primary-50 text-primary-600',
      inactive: 'text-gray-500 hover:text-gray-700',
    },
    actions: 'flex items-center',
  },
  footer: {
    base: 'bg-black py-12',
    container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    grid: 'grid grid-cols-1 md:grid-cols-4 gap-8',
    column: 'w-full',
    title: 'text-lg font-bold text-white',
    text: 'mt-4 text-gray-400',
  },
  form: {
    base: 'space-y-6',
    field: 'grid grid-cols-1 md:grid-cols-2 gap-6',
    item: 'w-full',
    label: 'block text-sm font-medium text-gray-700 mb-1',
    message: {
      base: 'mt-1 text-sm',
      error: 'text-error-500',
      helper: 'text-gray-500',
    },
  },
  table: {
    base: 'min-w-full divide-y divide-gray-200',
    head: 'bg-gray-50',
    body: 'bg-white divide-y divide-gray-200',
    row: 'hover:bg-gray-50',
    header: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
    cell: 'px-6 py-4 whitespace-nowrap text-sm text-gray-500',
  },
  alert: {
    base: 'rounded-md p-4',
    variants: {
      default: 'bg-blue-50 border border-blue-200',
      success: 'bg-green-50 border border-green-200',
      warning: 'bg-yellow-50 border border-yellow-200',
      error: 'bg-red-50 border border-red-200',
    },
    title: 'text-sm font-medium mb-1',
    description: 'text-sm',
  },
}

// Tema completo
export const theme = {
  colors,
  typography,
  spacing,
  borders,
  shadows,
  breakpoints,
  components,
}

export default theme