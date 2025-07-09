# 自控力管理应用 (Self-Control App)

一个基于 uni-app 开发的跨平台自控力管理应用，帮助用户通过任务管理和积分奖励系统培养良好的习惯。

## 📱 应用简介

这是一个专为提升自控力而设计的移动应用，通过任务完成获得积分，积分可用于兑换奖励，形成正向激励循环。应用采用现代化的UI设计，提供直观的用户体验。

## ✨ 主要功能

### 🎯 任务管理
- **任务创建**: 支持自定义任务名称、详情、图标和积分奖励
- **任务完成**: 点击完成任务获得积分，支持取消完成
- **任务重置**: 每日自动重置任务状态，保持新鲜感
- **批量操作**: 支持批量删除任务
- **图标选择**: 丰富的图标库，按分类组织（学习、运动、休息、其他）

### 💰 积分系统
- **积分获取**: 完成任务自动获得积分
- **积分显示**: 实时显示当前积分余额
- **积分保护**: 积分不会为负数，确保正向激励

### 🏪 积分商城
- **奖励分类**: 按类别组织奖励项目
- **奖励兑换**: 使用积分兑换心仪奖励
- **分类管理**: 支持自定义奖励分类

### 🎒 奖励背包
- **奖励存储**: 兑换的奖励存储在背包中
- **奖励使用**: 随时使用已兑换的奖励
- **数量管理**: 显示每个奖励的数量

### 👤 个人中心
- **功能导航**: 快速访问各个功能模块
- **商城管理**: 管理奖励分类和奖励项
- **统计功能**: 查看任务完成统计和数据分析
- **设置选项**: 应用设置和偏好配置

## 🛠 技术栈

- **框架**: uni-app (Vue 3)
- **语言**: JavaScript (ES6+)
- **样式**: SCSS
- **状态管理**: Vue 3 Composition API
- **存储**: uni-app 本地存储
- **UI组件**: uni-ui 组件库

## 📁 项目结构

```
self-control/
├── App.vue                 # 应用入口文件
├── main.js                 # 主入口文件
├── manifest.json           # 应用配置文件
├── index.html              # HTML模板
├── components/             # 公共组件
│   ├── IconPicker.vue      # 图标选择器
│   ├── IconPickerDialog.vue # 图标选择弹窗
│   ├── RewardItem.vue      # 奖励项组件
│   └── TaskItem.vue        # 任务项组件
├── composables/            # 组合式函数
│   ├── useTaskList.js      # 任务列表管理
│   ├── useScore.js         # 积分管理
│   ├── useRewards.js       # 奖励管理
│   ├── useBackpack.js      # 背包管理
│   └── useStatistics.js    # 统计功能管理
├── pages/                  # 页面文件
│   ├── index/              # 首页
│   ├── task-list/          # 任务列表页
│   ├── score-mall/         # 积分商城页
│   ├── backpack/           # 奖励背包页
│   ├── profile/            # 个人中心页
│   ├── statistics/         # 统计页面
│   └── mall-manage/        # 商城管理页
└── uni_modules/            # uni-app 模块
    ├── uni-icons/          # 图标组件
    ├── uni-popup/          # 弹窗组件
    └── ...                 # 其他UI组件
```

## 🚀 快速开始

### 环境要求
- Node.js 14.0+
- HBuilderX 或 VS Code
- uni-app CLI

### 安装步骤

1. **克隆项目**
   ```bash
   git clone [项目地址]
   cd self-control
   ```

2. **安装依赖**
   ```bash
   npm install
   # 或
   yarn install
   ```

3. **运行项目**
   ```bash
   # 开发模式
   npm run dev:h5
   npm run dev:mp-weixin
   npm run dev:app
   
   # 或使用 HBuilderX 打开项目
   ```

4. **构建发布**
   ```bash
   # 构建H5版本
   npm run build:h5
   
   # 构建微信小程序
   npm run build:mp-weixin
   
   # 构建App
   npm run build:app
   ```

## 📱 支持平台

- ✅ H5 (Web)
- ✅ 微信小程序
- ✅ 支付宝小程序
- ✅ App (Android/iOS)
- ✅ 其他小程序平台

## 🎨 设计特色

- **现代化UI**: 采用渐变色彩和圆角设计
- **响应式布局**: 适配不同屏幕尺寸
- **流畅动画**: 丰富的交互动效
- **直观操作**: 简洁明了的用户界面

## 🔧 核心功能实现

### 任务管理 (useTaskList.js)
- 本地存储任务数据
- 每日自动重置任务状态
- 积分联动机制
- 批量操作支持

### 积分系统 (useScore.js)
- 单例模式确保数据一致性
- 自动本地存储
- 积分保护机制

### 奖励系统 (useRewards.js)
- 分类管理奖励
- 动态奖励列表
- 兑换逻辑处理

### 统计系统 (useStatistics.js)
- 任务完成历史记录
- 本周/本月汇总统计
- 近21天完成情况分析
- 表格数据展示

## 📊 数据存储

应用使用 uni-app 的本地存储功能：
- 任务数据: `my_tasks`
- 积分数据: `user_score`
- 重置日期: `last_reset_date`
- 奖励数据: `rewards_data`
- 背包数据: `backpack_data`
- 任务完成历史: `task_completion_history`

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系方式

如有问题或建议，请通过以下方式联系：
- 提交 Issue
- 发送邮件
- 项目讨论区

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者和用户！

---

**注意**: 这是一个学习项目，主要用于展示 uni-app 开发技能和自控力管理应用的设计思路。 