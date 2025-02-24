---
title: 深入浅出 Webpack5 模块联邦
date: 2023-04-16
cover: /bac7.jpg
tags:
 - Webpack
 - 微前端
 - 前端工程化
categories:
 - 技术笔记
---

::: tip
详细解析 Webpack5 模块联邦（Module Federation）的原理、实现和最佳实践。
:::

<!-- more -->

## 1. 模块联邦简介

模块联邦（Module Federation）是 Webpack 5 的一个核心特性，它允许多个独立的构建组成一个应用程序，这些独立的构建之间没有依赖关系，可以独立开发、部署。

### 1.1 核心概念

```javascript
// webpack.config.js
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'host',
      filename: 'remoteEntry.js',
      remotes: {
        app1: 'app1@http://localhost:3001/remoteEntry.js',
      },
      exposes: {
        './Button': './src/Button',
      },
      shared: ['react', 'react-dom'],
    }),
  ],
};
```

## 2. 高级配置与应用

### 2.1 动态远程容器

```javascript
// 动态加载远程模块
const loadComponent = async (scope, module) => {
  await __webpack_init_sharing__('default');
  const container = window[scope];
  await container.init(__webpack_share_scopes__.default);
  const factory = await window[scope].get(module);
  const Module = factory();
  return Module;
};
```

### 2.2 共享依赖策略

```javascript
{
  shared: {
    react: {
      singleton: true,
      requiredVersion: '^17.0.2',
      eager: true
    },
    'react-dom': {
      singleton: true,
      requiredVersion: '^17.0.2',
      eager: true
    }
  }
}
```

## 3. 实战案例：微前端架构

### 3.1 主应用配置

```javascript
// host/webpack.config.js
module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'host',
      filename: 'remoteEntry.js',
      remotes: {
        app1: 'app1@http://localhost:3001/remoteEntry.js',
        app2: 'app2@http://localhost:3002/remoteEntry.js'
      },
      shared: {
        ...deps,
        react: { singleton: true },
        'react-dom': { singleton: true }
      }
    })
  ]
};
```

### 3.2 子应用集成

```javascript
// app1/webpack.config.js
module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'app1',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/App',
        './components/Button': './src/components/Button',
        './components/Header': './src/components/Header'
      },
      shared: {
        ...deps,
        react: { singleton: true },
        'react-dom': { singleton: true }
      }
    })
  ]
};
```

## 4. 性能优化与注意事项

### 4.1 加载优化

```javascript
// 预加载远程模块
const preloadRemote = (remoteName, moduleKey) => {
  const remoteUrl = remoteMap[remoteName];
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = remoteUrl;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
};
```

### 4.2 错误处理

```javascript
const loadRemoteModule = async (remoteName, moduleKey) => {
  try {
    await preloadRemote(remoteName);
    const container = window[remoteName];
    await container.init(__webpack_share_scopes__.default);
    const factory = await container.get(moduleKey);
    return factory();
  } catch (error) {
    console.error(`Failed to load remote module: ${remoteName}/${moduleKey}`);
    throw error;
  }
};
```

## 5. 生产环境部署

### 5.1 版本控制

```javascript
const getRemoteUrl = (remoteName, version) => {
  return `https://cdn.example.com/${remoteName}/${version}/remoteEntry.js`;
};

const loadVersionedRemote = async (remoteName, version) => {
  const url = getRemoteUrl(remoteName, version);
  // 实现版本控制逻辑
};
```

### 5.2 监控与告警

```javascript
const monitorRemoteLoad = (remoteName) => {
  const startTime = performance.now();
  return {
    success: () => {
      const duration = performance.now() - startTime;
      sendMetric('remote_load_success', { remoteName, duration });
    },
    failure: (error) => {
      sendMetric('remote_load_failure', { remoteName, error: error.message });
    }
  };
};
```

## 总结

模块联邦为前端微服务架构提供了强大的支持，但在使用时需要注意：

1. 合理规划共享依赖
2. 注意版本兼容性
3. 实现可靠的错误处理
4. 优化加载性能
5. 做好监控和运维

## 参考资料

- [Webpack 5 Module Federation](https://webpack.js.org/concepts/module-federation/)
- [Micro-Frontends](https://micro-frontends.org/)
- [Module Federation Examples](https://github.com/module-federation/module-federation-examples) 