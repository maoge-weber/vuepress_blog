---
title: 前端工程化：从 Monorepo 到微服务架构
date: 2023-08-22
cover: /bac8.jpg
tags:
 - 工程化
 - Monorepo
 - 微服务
categories:
 - 技术笔记
---

::: tip
探讨现代前端工程化体系，从 Monorepo 到微服务架构的演进之路。
:::

<!-- more -->

## 1. Monorepo 基础架构

### 1.1 使用 pnpm + workspace

```json
{
  "name": "my-monorepo",
  "private": true,
  "workspaces": [
    "packages/*",
    "apps/*"
  ],
  "scripts": {
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint"
  }
}
```

### 1.2 Turborepo 配置

```javascript
// turbo.json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": []
    },
    "lint": {
      "outputs": []
    },
    "dev": {
      "cache": false
    }
  }
}
```

## 2. 包管理与依赖治理

### 2.1 依赖提升策略

```javascript
// pnpm-workspace.yaml
packages:
  - 'packages/*'
  - 'apps/*'
  - '!**/test/**'

// .npmrc
shamefully-hoist=true
strict-peer-dependencies=false
```

### 2.2 版本管理

```javascript
// lerna.json
{
  "version": "independent",
  "npmClient": "pnpm",
  "command": {
    "publish": {
      "conventionalCommits": true,
      "message": "chore(release): publish"
    }
  }
}
```

## 3. 微服务架构设计

### 3.1 微前端基础架构

```javascript
// micro-app.config.js
import { registerMicroApps, start } from 'qiankun';

registerMicroApps([
  {
    name: 'vue-app',
    entry: '//localhost:8080',
    container: '#vue-container',
    activeRule: '/vue',
    props: {
      shared: sharedLibs,
      events: eventBus
    }
  },
  {
    name: 'react-app',
    entry: '//localhost:3000',
    container: '#react-container',
    activeRule: '/react'
  }
]);

start({
  prefetch: true,
  sandbox: {
    strictStyleIsolation: true
  }
});
```

### 3.2 状态管理与通信

```typescript
// shared-state.ts
import { createStore } from 'vuex';
import { BehaviorSubject } from 'rxjs';

interface SharedState {
  user: UserInfo;
  theme: ThemeConfig;
  permissions: string[];
}

class StateManager {
  private store: BehaviorSubject<SharedState>;
  
  constructor(initialState: SharedState) {
    this.store = new BehaviorSubject(initialState);
  }

  subscribe(callback: (state: SharedState) => void) {
    return this.store.subscribe(callback);
  }

  dispatch(action: string, payload: any) {
    const currentState = this.store.getValue();
    // 处理状态更新逻辑
    this.store.next(newState);
  }
}
```

## 4. CI/CD 流水线

### 4.1 Github Actions 配置

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
        
    - name: Install pnpm
      run: npm install -g pnpm
        
    - name: Install dependencies
      run: pnpm install
        
    - name: Run tests
      run: pnpm test
        
    - name: Build
      run: pnpm build
        
    - name: Deploy
      if: github.ref == 'refs/heads/main'
      run: |
        # 部署脚本
```

### 4.2 自动化测试

```typescript
// jest.config.js
module.exports = {
  projects: [
    '<rootDir>/packages/*',
    '<rootDir>/apps/*'
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

## 5. 性能监控与优化

### 5.1 性能指标收集

```typescript
// performance-monitor.ts
class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();

  collectMetric(name: string, value: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(value);
  }

  reportMetrics() {
    const report = {};
    this.metrics.forEach((values, name) => {
      report[name] = {
        avg: values.reduce((a, b) => a + b) / values.length,
        min: Math.min(...values),
        max: Math.max(...values),
        p95: this.calculatePercentile(values, 95)
      };
    });
    return report;
  }

  private calculatePercentile(values: number[], p: number) {
    const sorted = [...values].sort((a, b) => a - b);
    const pos = (sorted.length - 1) * p / 100;
    return sorted[Math.floor(pos)];
  }
}
```

## 总结

现代前端工程化体系需要考虑的关键点：

1. 合理的项目结构和依赖管理
2. 高效的构建系统
3. 可靠的微服务架构
4. 完善的 CI/CD 流程
5. 全面的监控体系

## 参考资料

- [Monorepo Tools](https://monorepo.tools/)
- [Micro Frontends](https://micro-frontends.org/)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Turborepo](https://turborepo.org/) 