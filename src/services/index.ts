// src/services/index.ts
export { api, tokenManager } from './base';
export { authAPI } from './auth';
export { productsAPI, adminProductsAPI } from './products';
export { ordersAPI, adminOrdersAPI } from './orders';
export { userAPI } from './user';
export { affiliateAPI } from './affiliate';
export {
  adminUsersAPI,
  adminAffiliatesAPI,
  adminCommissionsAPI,
  adminWithdrawalsAPI,
  adminSettingsAPI,
  adminDashboardAPI
} from './admin';
export { supportAPI } from './support';
export { healthAPI } from './health';
export * from "./messageService";