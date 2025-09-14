// Permissions for each role
export const PERMISSIONS = {
  // Admin permissions
  MANAGE_USERS: 'manage_users',
  VIEW_ALL_ORDERS: 'view_all_orders',
  CONTROL_DYNAMIC_PRICING: 'control_dynamic_pricing',
  FINANCIAL_REPORTS: 'financial_reports',
  INCIDENT_MANAGEMENT: 'incident_management',
  CONTENT_MGMT: 'content_mgmt',
  
  // Vendor permissions
  REGISTER_STOCK: 'register_stock',
  SET_PRICES: 'set_prices',
  VIEW_OWN_ORDERS: 'view_own_orders',
  MANAGE_AVAILABILITY: 'manage_availability',
  VIEW_REPORTS: 'view_reports',
  
  // Courier permissions
  ACCEPT_ORDERS: 'accept_orders',
  UPDATE_DELIVERY_STATUS: 'update_delivery_status',
  COLLECT_CONFIRMATION: 'collect_confirmation',
  DELIVERY_CONFIRMATION: 'delivery_confirmation',
  VIEW_EARNINGS: 'view_earnings',
  
  // Client permissions
  CREATE_ORDER: 'create_order',
  TRACK_ORDER: 'track_order',
  MAKE_PAYMENT: 'make_payment',
  RATE_DELIVERY: 'rate_delivery',
} as const;

// Role permission mappings
export const ROLE_PERMISSIONS = {
  admin: [
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.VIEW_ALL_ORDERS,
    PERMISSIONS.CONTROL_DYNAMIC_PRICING,
    PERMISSIONS.FINANCIAL_REPORTS,
    PERMISSIONS.INCIDENT_MANAGEMENT,
    PERMISSIONS.CONTENT_MGMT,
    // Admins also have all other permissions
    ...Object.values(PERMISSIONS),
  ],
  vendor: [
    PERMISSIONS.REGISTER_STOCK,
    PERMISSIONS.SET_PRICES,
    PERMISSIONS.VIEW_OWN_ORDERS,
    PERMISSIONS.MANAGE_AVAILABILITY,
    PERMISSIONS.VIEW_REPORTS,
  ],
  courier: [
    PERMISSIONS.ACCEPT_ORDERS,
    PERMISSIONS.UPDATE_DELIVERY_STATUS,
    PERMISSIONS.COLLECT_CONFIRMATION,
    PERMISSIONS.DELIVERY_CONFIRMATION,
    PERMISSIONS.VIEW_EARNINGS,
  ],
  client: [
    PERMISSIONS.CREATE_ORDER,
    PERMISSIONS.TRACK_ORDER,
    PERMISSIONS.MAKE_PAYMENT,
    PERMISSIONS.RATE_DELIVERY,
  ],
} as const;

// Helper function to check if user has permission
export function hasPermission(userRole: string, permission: string): boolean {
  const rolePermissions = ROLE_PERMISSIONS[userRole as keyof typeof ROLE_PERMISSIONS];
  return rolePermissions?.includes(permission as any) || false;
}

// Helper function to check if user has any of the permissions
export function hasAnyPermission(userRole: string, permissions: string[]): boolean {
  return permissions.some(permission => hasPermission(userRole, permission));
}

// Helper function to check if user has all permissions
export function hasAllPermissions(userRole: string, permissions: string[]): boolean {
  return permissions.every(permission => hasPermission(userRole, permission));
}