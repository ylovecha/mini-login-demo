import { config, errorCodes, dataStructures } from './config';
import { authUtils, httpUtils, validationUtils } from './utils';
import { http } from './httpClient';

// 认证服务类
class AuthService {
  constructor() {
    this.baseUrl = config.api.baseUrl;
    this.timeout = config.api.timeout;
  }

  // 发送HTTP请求的通用方法
  async request(endpoint, options = {}) {
    try {
      const response = await http.post(endpoint, options.body || {}, {
        timeout: this.timeout,
        ...options
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // 用户登录
  async login(username, password) {
    try {
      const response = await this.request(config.auth.endpoints.login, {
        method: 'POST',
        body: JSON.stringify({
          username,
          password
        })
      });

      // 处理登录成功 - 支持多种响应格式
      if (response.success || response.token || response.code === 200) {
        console.log('登录响应数据:', response);
        
        // 保存认证信息
        const userData = response.data || response.user || {};
        
        // 生成一个简单的token（因为后端没有返回token）
        const generatedToken = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        console.log('生成的token:', generatedToken);
        console.log('用户数据:', userData);
        
        authUtils.saveAuthData({
          token: response.token || response.data?.token || generatedToken,
          refreshToken: response.refreshToken || response.data?.refreshToken || generatedToken,
          user: userData
        });
        
        // 为了兼容性，也保存用户名和用户ID到localStorage
        if (userData.username) {
          localStorage.setItem('username', userData.username);
        }
        if (userData.userId || userData.id) {
          localStorage.setItem('userId', userData.userId || userData.id);
        }
        
        // 验证数据是否保存成功
        const savedToken = localStorage.getItem('auth_token');
        console.log('保存后的token:', savedToken);

        return {
          success: true,
          message: response.msg || response.message || '登录成功',
          data: response.data || response
        };
      } else {
        // 处理登录失败
        return {
          success: false,
          message: response.msg || response.message || '登录失败',
          error: response.error
        };
      }
    } catch (error) {
      console.error('登录请求失败:', error);
      return {
        success: false,
        message: error.message || '网络请求失败',
        error: error
      };
    }
  }

  // 用户登出
  async logout() {
    try {
      // 调用登出接口
      await this.request(authConfig.api.endpoints.logout, {
        method: 'POST'
      });
    } catch (error) {
      console.error('登出请求失败:', error);
    } finally {
      // 无论接口是否成功，都清除本地存储
      authUtils.clearAuthData();
    }
  }

  // 获取用户信息
  async getUserProfile() {
    try {
      const response = await this.request(authConfig.api.endpoints.profile, {
        method: 'GET'
      });

      if (response.success || response.user || response.code === 200) {
        // 更新本地存储的用户信息
        const userData = response.user || response.data?.user;
        if (userData) {
          localStorage.setItem(authConfig.auth.userKey, JSON.stringify(userData));
        }
        return response;
      }
    } catch (error) {
      console.error('获取用户信息失败:', error);
      throw error;
    }
  }

  // 刷新token
  async refreshToken() {
    try {
      const refreshToken = authUtils.getAuthData().refreshToken;
      if (!refreshToken) {
        throw new Error('没有可用的refresh token');
      }

      const response = await this.request(authConfig.api.endpoints.refresh, {
        method: 'POST',
        body: JSON.stringify({
          refreshToken
        })
      });

      if (response.success || response.token || response.code === 200) {
        // 保存新的token
        authUtils.saveAuthData({
          token: response.token || response.data?.token,
          refreshToken: response.refreshToken || response.data?.refreshToken
        });
        return response;
      }
    } catch (error) {
      console.error('刷新token失败:', error);
      // 刷新失败，清除认证信息
      authUtils.clearAuthData();
      throw error;
    }
  }

  // 检查认证状态
  checkAuthStatus() {
    if (!authUtils.isLoggedIn()) {
      return { isAuthenticated: false, message: '未登录' };
    }

    if (authUtils.isTokenExpired()) {
      return { isAuthenticated: false, message: 'token已过期' };
    }

    return { isAuthenticated: true, message: '已认证' };
  }
}

// 创建单例实例
const authService = new AuthService();

export default authService; 