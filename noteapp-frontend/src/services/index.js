// 统一服务导出文件
export { config, errorCodes, dataStructures } from './config';
export { authUtils, aiUtils, httpUtils, validationUtils } from './utils';
export { default as authService } from './authService';
export { http, default as httpClient } from './httpClient';

// 默认导出所有服务
export default {
  config: () => import('./config'),
  utils: () => import('./utils'),
  authService: () => import('./authService'),
  httpClient: () => import('./httpClient')
}; 