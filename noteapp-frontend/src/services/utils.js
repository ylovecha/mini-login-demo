// 通用工具函数
import { config } from './config';

// 认证工具函数
export const authUtils = {
  // 保存认证信息到localStorage
  saveAuthData(data) {
    if (data.token) {
      localStorage.setItem(config.auth.tokenKey, data.token);
    }
    if (data.refreshToken) {
      localStorage.setItem(config.auth.refreshTokenKey, data.refreshToken);
    }
    if (data.user) {
      localStorage.setItem(config.auth.userKey, JSON.stringify(data.user));
    }
  },
  
  // 从localStorage获取认证信息
  getAuthData() {
    return {
      token: localStorage.getItem(config.auth.tokenKey),
      refreshToken: localStorage.getItem(config.auth.refreshTokenKey),
      user: JSON.parse(localStorage.getItem(config.auth.userKey) || 'null')
    };
  },
  
  // 清除认证信息
  clearAuthData() {
    localStorage.removeItem(config.auth.tokenKey);
    localStorage.removeItem(config.auth.refreshTokenKey);
    localStorage.removeItem(config.auth.userKey);
  },
  
  // 检查是否已登录
  isLoggedIn() {
    const token = localStorage.getItem(config.auth.tokenKey);
    return !!token;
  },
  
  // 检查token是否过期
  isTokenExpired() {
    const token = localStorage.getItem(config.auth.tokenKey);
    if (!token) return true;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp < Date.now() / 1000;
    } catch (error) {
      return true;
    }
  },
  
  // 获取用户信息
  getUserInfo() {
    const userStr = localStorage.getItem(config.auth.userKey);
    return userStr ? JSON.parse(userStr) : null;
  },
  
  // 获取用户ID
  getUserId() {
    const user = this.getUserInfo();
    return user ? (user.userId || user.id) : null;
  },
  
  // 获取用户名
  getUsername() {
    const user = this.getUserInfo();
    return user ? user.username : null;
  }
};

// AI工具函数
export const aiUtils = {
  // 计算阅读时间
  calculateReadingTime(text, wordsPerMinute = 200) {
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  },
  
  // 清理文本内容
  cleanText(text) {
    return text
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s\u4e00-\u9fff]/g, '')
      .trim();
  },
  
  // 提取关键词（简单实现）
  extractKeywords(text, maxKeywords = 10) {
    const cleanedText = this.cleanText(text);
    const words = cleanedText.split(/\s+/);
    const wordCount = {};
    
    words.forEach(word => {
      if (word.length > 1 && !config.ai.stopWords.includes(word)) {
        wordCount[word] = (wordCount[word] || 0) + 1;
      }
    });
    
    return Object.entries(wordCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, maxKeywords)
      .map(([word]) => word);
  },
  
  // 主题分类（简单实现）
  classifyTopics(text) {
    const cleanedText = this.cleanText(text);
    const matchedTopics = [];
    
    config.ai.topics.forEach(topic => {
      const matchCount = topic.keywords.filter(keyword => 
        cleanedText.includes(keyword)
      ).length;
      
      if (matchCount > 0) {
        matchedTopics.push({
          name: topic.name,
          confidence: matchCount / topic.keywords.length,
          keywords: topic.keywords.filter(keyword => cleanedText.includes(keyword))
        });
      }
    });
    
    return matchedTopics.sort((a, b) => b.confidence - a.confidence);
  },
  
  // 生成摘要（简单实现）
  generateSummary(text, maxLength = 200) {
    const sentences = text.split(/[。！？.!?]/).filter(s => s.trim());
    let summary = '';
    
    for (const sentence of sentences) {
      if ((summary + sentence).length <= maxLength) {
        summary += sentence + '。';
      } else {
        break;
      }
    }
    
    return summary || text.substring(0, maxLength) + '...';
  }
};

// HTTP请求工具函数 - 已迁移到axios，保留用于向后兼容
export const httpUtils = {
  // 创建请求头 - 现在由axios拦截器自动处理
  createHeaders(customHeaders = {}) {
    console.warn('httpUtils.createHeaders已废弃，请使用axios客户端');
    return {
      'Content-Type': 'application/json',
      ...customHeaders
    };
  },
  
  // 处理HTTP响应 - 现在由axios拦截器自动处理
  async handleResponse(response) {
    console.warn('httpUtils.handleResponse已废弃，请使用axios客户端');
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  },
  
  // 创建超时控制器 - 现在由axios自动处理
  createTimeoutController(timeout) {
    console.warn('httpUtils.createTimeoutController已废弃，请使用axios客户端');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    return { controller, timeoutId };
  }
};

// 数据验证工具函数
export const validationUtils = {
  // 验证用户名
  validateUsername(username) {
    return username && username.length >= 3 && username.length <= 20;
  },
  
  // 验证密码
  validatePassword(password) {
    return password && password.length >= 6;
  },
  
  // 验证邮箱
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  
  // 验证笔记内容
  validateNoteContent(content) {
    return content && content.trim().length > 0;
  }
}; 