---
title: 微前端架构：qiankun 实践指南
date: 2023-06-18
cover: /bac3.png
tags:
 - 微前端
 - qiankun
 - 前端架构
categories:
 - 技术笔记
---

::: tip
详细介绍基于 qiankun 的微前端架构实践，包括项目搭建、应用接入、数据通信等核心内容。
:::

<!-- more -->

## 1. qiankun 基础配置

### 1.1 主应用配置

```javascript
// main.js
import { registerMicroApps, start } from 'qiankun';

// 注册子应用
registerMicroApps([
  {
    name: 'vue-app',
    entry: '//localhost:8081',
    container: '#vue-container',
    activeRule: '/vue-app',
    props: {
      shared: {
        utils: Utils,
        store: Store
      }
    }
  },
  {
    name: 'react-app',
    entry: '//localhost:3000',
    container: '#react-container',
    activeRule: '/react-app'
  }
]);

// 启动应用
start({
  prefetch: true,  // 预加载
  sandbox: {
    strictStyleIsolation: true  // 严格的样式隔离
  }
});
```

### 1.2 Vue子应用配置

```javascript
// vue.config.js
const { name } = require('./package');

module.exports = {
  devServer: {
    port: 8081,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },
  configureWebpack: {
    output: {
      library: `${name}-[name]`,
      libraryTarget: 'umd',
      jsonpFunction: `webpackJsonp_${name}`
    }
  }
};

// main.js
import { createApp } from 'vue';
import App from './App.vue';

let instance = null;

function render(props = {}) {
  const { container } = props;
  instance = createApp(App);
  instance.mount(container ? container.querySelector('#app') : '#app');
}

// 独立运行时
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}

// 导出生命周期钩子
export async function bootstrap() {
  console.log('[vue] app bootstraped');
}

export async function mount(props) {
  console.log('[vue] props from main app', props);
  render(props);
}

export async function unmount() {
  instance.unmount();
  instance = null;
}
```

## 2. 应用间通信

### 2.1 Actions 通信机制

```javascript
// 主应用
import { initGlobalState } from 'qiankun';

const initialState = {
  user: {
    name: 'admin',
    role: 'administrator'
  }
};

const actions = initGlobalState(initialState);

actions.onGlobalStateChange((state, prev) => {
  console.log('主应用: 变更前', prev);
  console.log('主应用: 变更后', state);
});

// 子应用
export function mount(props) {
  props.onGlobalStateChange((state, prev) => {
    console.log('子应用: 变更前', prev);
    console.log('子应用: 变更后', state);
  });

  props.setGlobalState({
    user: {
      name: 'guest',
      role: 'visitor'
    }
  });
}
```

### 2.2 共享数据存储

```typescript
// shared-store.ts
import { BehaviorSubject } from 'rxjs';

interface SharedState {
  user: UserInfo;
  permissions: string[];
  theme: ThemeConfig;
}

class SharedStore {
  private state$: BehaviorSubject<SharedState>;

  constructor(initialState: SharedState) {
    this.state$ = new BehaviorSubject(initialState);
  }

  getState() {
    return this.state$.getValue();
  }

  setState(partial: Partial<SharedState>) {
    this.state$.next({
      ...this.getState(),
      ...partial
    });
  }

  subscribe(callback: (state: SharedState) => void) {
    return this.state$.subscribe(callback);
  }
}

export const sharedStore = new SharedStore({
  user: null,
  permissions: [],
  theme: 'light'
});
```

## 3. 性能优化

### 3.1 预加载策略

```javascript
// 自定义预加载策略
start({
  prefetch: 'all',  // 预加载所有子应用
  sandbox: {
    strictStyleIsolation: true
  }
});

// 或者自定义预加载
start({
  prefetch: (apps) => apps.map(app => {
    // 指定要预加载的应用
    return { name: app.name, entry: app.entry };
  })
});
```

### 3.2 沙箱优化

```javascript
// 配置沙箱选项
start({
  sandbox: {
    strictStyleIsolation: true,  // 严格的样式隔离
    experimentalStyleIsolation: true,  // 实验性的样式隔离
    defaultStrictStyleIsolation: true  // 默认严格样式隔离
  }
});
```

## 4. 部署配置

### 4.1 Nginx配置

```nginx
server {
    listen       80;
    server_name  micro-frontend.example.com;

    # 主应用
    location / {
        root   /usr/share/nginx/html/main;
        index  index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    # Vue子应用
    location /vue-app {
        root   /usr/share/nginx/html/vue;
        try_files $uri $uri/ /index.html;
    }

    # React子应用
    location /react-app {
        root   /usr/share/nginx/html/react;
        try_files $uri $uri/ /index.html;
    }
}
```

### 4.2 CI/CD配置

```yaml
# .gitlab-ci.yml
stages:
  - build
  - deploy

build-main:
  stage: build
  script:
    - npm install
    - npm run build
  artifacts:
    paths:
      - dist/

build-sub-apps:
  stage: build
  script:
    - cd vue-app && npm install && npm run build
    - cd ../react-app && npm install && npm run build
  artifacts:
    paths:
      - vue-app/dist/
      - react-app/dist/

deploy:
  stage: deploy
  script:
    - docker build -t micro-frontend .
    - docker push micro-frontend
```

## 总结

qiankun 微前端架构的关键点：

1. 应用注册与配置
2. 生命周期管理
3. 应用间通信
4. 样式隔离
5. 性能优化

## 参考资料

- [qiankun 官方文档](https://qiankun.umijs.org/zh)
- [微前端架构设计](https://micro-frontends.org/)
- [实战微前端](https://www.yuque.com/kuitos/gky7yw) 