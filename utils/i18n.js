// 轻量级i18n工具，专门适配uni-app，支持响应式更新
import { ref, reactive } from 'vue'

const STORAGE_KEY = 'app_locale'

// 语言包
const messages = {
  zh: {
    // 通用
    common: {
      confirm: '确定',
      cancel: '取消',
      save: '保存',
      delete: '删除',
      edit: '编辑',
      add: '添加',
      reset: '重置',
      search: '搜索',
      loading: '加载中...',
      noData: '暂无数据',
      back: '返回',
      next: '下一步',
      previous: '上一步',
      close: '关闭',
      open: '打开',
      refresh: '刷新',
      submit: '提交',
      clear: '清空',
      select: '选择',
      all: '全部',
      none: '无',
      yes: '是',
      no: '否',
      ok: '确定',
      error: '错误',
      success: '成功',
      warning: '警告',
      info: '信息'
    },

    // 导航
    nav: {
      home: '首页',
      taskList: '任务列表',
      statistics: '统计中心',
      scoreMall: '积分商城',
      backpack: '背包',
      profile: '个人中心'
    },

    // 任务相关
    task: {
      title: '任务列表',
      addTask: '添加任务',
      taskName: '任务名称',
      taskDetail: '任务详情',
      taskScore: '任务积分',
      taskType: '任务类型',
      permanent: '长期任务',
      temporary: '临时任务',
      temporaryTip: '临时任务完成后，第二天将自动从列表中移除',
      chooseIcon: '选择图标',
      icon: '图标',
      name: '名称',
      detail: '详情',
      score: '得分',
      completed: '已完成',
      uncompleted: '未完成',
      deleteTask: '删除任务',
      resetTask: '重置任务',
      confirmReset: '确认重置',
      resetConfirmText: '确定要重置所有任务状态吗？此操作不会影响积分。',
      taskReset: '任务已重置',
      emptyTask: '暂无任务，请添加',
      deleteSelected: '删除选中',
      resetAll: '重置所有',
      selectAll: '全选',
      unselectAll: '取消全选',
      taskCompleted: '任务已完成',
      taskUncompleted: '任务已取消完成'
    },

    // 统计相关
    statistics: {
      title: '统计中心',
      weeklySummary: '本周汇总',
      monthlySummary: '本月汇总',
      recent21Days: '近21天',
      totalScore: '总积分',
      totalTasks: '总任务',
      averageScore: '平均积分',
      averageTasks: '平均任务',
      completionRate: '完成率',
      completedDays: '完成天数',
      weeklyScore: '本周积分',
      weeklyTasks: '本周任务',
      monthlyScore: '本月积分',
      monthlyTasks: '本月任务',
      days21Score: '21天积分',
      days21Tasks: '21天任务',
      averageDailyScore: '平均每日积分',
      averageDailyTasks: '平均每日任务',
      progressTitle: '完成率',
      progressSubtitle: '天',
      date: '日期',
      score: '积分',
      completedTotal: '完成/总数',
      status: '状态',
      dayNumber: '第{day}天',
      scoreUnit: '分',
      taskUnit: '任务',
      rateUnit: '%',
      empty: '-',
      completed: '已完成',
      uncompleted: '未完成'
    },

    // 积分相关
    score: {
      score: '积分',
      scoreLabel: '积分:',
      addScore: '增加积分',
      subtractScore: '减少积分',
      currentScore: '当前积分',
      totalScore: '总积分',
      scoreHistory: '积分历史',
      scoreDetail: '积分详情',
      scoreSource: '积分来源',
      scoreTime: '积分时间',
      scoreAmount: '积分数量'
    },

    // 商城相关
    mall: {
      title: '积分商城',
      exchange: '兑换',
      exchangeConfirm: '确认兑换',
      exchangeSuccess: '兑换成功',
      exchangeFailed: '兑换失败',
      insufficientScore: '积分不足',
      itemName: '商品名称',
      itemPrice: '商品价格',
      itemDescription: '商品描述',
      itemImage: '商品图片',
      itemCategory: '商品分类',
      itemStock: '库存',
      itemSold: '已售',
      itemStatus: '状态',
      available: '可兑换',
      soldOut: '已售罄',
      comingSoon: '即将上架'
    },

    // 背包相关
    backpack: {
      title: '背包',
      itemName: '物品名称',
      itemCount: '物品数量',
      itemDescription: '物品描述',
      itemImage: '物品图片',
      itemType: '物品类型',
      itemRarity: '稀有度',
      itemEffect: '物品效果',
      useItem: '使用物品',
      useConfirm: '确认使用',
      useSuccess: '使用成功',
      useFailed: '使用失败',
      itemUsed: '物品已使用',
      itemExpired: '物品已过期',
      itemInvalid: '物品无效',
      emptyBackpack: '背包为空',
      backpackFull: '背包已满'
    },

    // 个人中心
    profile: {
      title: '个人中心',
      settings: '设置',
      language: '语言',
      theme: '主题',
      notification: '通知',
      privacy: '隐私',
      about: '关于',
      version: '版本',
      feedback: '反馈',
      help: '帮助',
      logout: '退出登录',
      login: '登录',
      register: '注册',
      username: '用户名',
      email: '邮箱',
      phone: '手机号',
      avatar: '头像',
      nickname: '昵称',
      gender: '性别',
      birthday: '生日',
      location: '位置',
      bio: '个人简介',
      male: '男',
      female: '女',
      other: '其他',
      editProfile: '编辑资料',
      saveProfile: '保存资料',
      profileSaved: '资料已保存',
      profileSaveFailed: '保存失败'
    },

    // 设置
    settings: {
      title: '设置',
      general: '通用',
      appearance: '外观',
      language: '语言设置',
      languageTip: '选择应用显示语言',
      theme: '主题设置',
      themeTip: '选择应用主题',
      light: '浅色',
      dark: '深色',
      auto: '跟随系统',
      notification: '通知设置',
      notificationTip: '管理应用通知',
      sound: '声音',
      vibration: '震动',
      badge: '角标',
      privacy: '隐私设置',
      privacyTip: '管理隐私选项',
      dataUsage: '数据使用',
      analytics: '分析数据',
      about: '关于应用',
      aboutTip: '查看应用信息',
      version: '版本号',
      copyright: '版权信息',
      terms: '服务条款',
      privacy: '隐私政策',
      feedback: '意见反馈',
      feedbackTip: '向我们反馈问题或建议',
      help: '帮助中心',
      helpTip: '查看使用帮助',
      logout: '退出登录',
      logoutTip: '退出当前账号',
      logoutConfirm: '确认退出',
      logoutConfirmText: '确定要退出登录吗？'
    }
  },

  en: {
    // Common
    common: {
      confirm: 'Confirm',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      add: 'Add',
      reset: 'Reset',
      search: 'Search',
      loading: 'Loading...',
      noData: 'No Data',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      close: 'Close',
      open: 'Open',
      refresh: 'Refresh',
      submit: 'Submit',
      clear: 'Clear',
      select: 'Select',
      all: 'All',
      none: 'None',
      yes: 'Yes',
      no: 'No',
      ok: 'OK',
      error: 'Error',
      success: 'Success',
      warning: 'Warning',
      info: 'Info'
    },

    // Navigation
    nav: {
      home: 'Home',
      taskList: 'Task List',
      statistics: 'Statistics',
      scoreMall: 'Score Mall',
      backpack: 'Backpack',
      profile: 'Profile'
    },

    // Task related
    task: {
      title: 'Task List',
      addTask: 'Add Task',
      taskName: 'Task Name',
      taskDetail: 'Task Detail',
      taskScore: 'Task Score',
      taskType: 'Task Type',
      permanent: 'Permanent Task',
      temporary: 'Temporary Task',
      temporaryTip: 'Temporary tasks will be automatically removed from the list the next day after completion',
      chooseIcon: 'Choose Icon',
      icon: 'Icon',
      name: 'Name',
      detail: 'Detail',
      score: 'Score',
      completed: 'Completed',
      uncompleted: 'Uncompleted',
      deleteTask: 'Delete Task',
      resetTask: 'Reset Task',
      confirmReset: 'Confirm Reset',
      resetConfirmText: 'Are you sure you want to reset all task status? This operation will not affect the score.',
      taskReset: 'Tasks Reset',
      emptyTask: 'No tasks, please add',
      deleteSelected: 'Delete Selected',
      resetAll: 'Reset All',
      selectAll: 'Select All',
      unselectAll: 'Unselect All',
      taskCompleted: 'Task Completed',
      taskUncompleted: 'Task Uncompleted'
    },

    // Statistics related
    statistics: {
      title: 'Statistics Center',
      weeklySummary: 'Weekly Summary',
      monthlySummary: 'Monthly Summary',
      recent21Days: 'Recent 21 Days',
      totalScore: 'Total Score',
      totalTasks: 'Total Tasks',
      averageScore: 'Average Score',
      averageTasks: 'Average Tasks',
      completionRate: 'Completion Rate',
      completedDays: 'Completed Days',
      weeklyScore: 'Weekly Score',
      weeklyTasks: 'Weekly Tasks',
      monthlyScore: 'Monthly Score',
      monthlyTasks: 'Monthly Tasks',
      days21Score: '21 Days Score',
      days21Tasks: '21 Days Tasks',
      averageDailyScore: 'Average Daily Score',
      averageDailyTasks: 'Average Daily Tasks',
      progressTitle: 'Completion Rate',
      progressSubtitle: 'days',
      date: 'Date',
      score: 'Score',
      completedTotal: 'Completed/Total',
      status: 'Status',
      dayNumber: 'Day {day}',
      scoreUnit: 'pts',
      taskUnit: 'tasks',
      rateUnit: '%',
      empty: '-',
      completed: 'Completed',
      uncompleted: 'Uncompleted'
    },

    // Score related
    score: {
      score: 'Score',
      scoreLabel: 'Score:',
      addScore: 'Add Score',
      subtractScore: 'Subtract Score',
      currentScore: 'Current Score',
      totalScore: 'Total Score',
      scoreHistory: 'Score History',
      scoreDetail: 'Score Detail',
      scoreSource: 'Score Source',
      scoreTime: 'Score Time',
      scoreAmount: 'Score Amount'
    },

    // Mall related
    mall: {
      title: 'Score Mall',
      exchange: 'Exchange',
      exchangeConfirm: 'Confirm Exchange',
      exchangeSuccess: 'Exchange Success',
      exchangeFailed: 'Exchange Failed',
      insufficientScore: 'Insufficient Score',
      itemName: 'Item Name',
      itemPrice: 'Item Price',
      itemDescription: 'Item Description',
      itemImage: 'Item Image',
      itemCategory: 'Item Category',
      itemStock: 'Stock',
      itemSold: 'Sold',
      itemStatus: 'Status',
      available: 'Available',
      soldOut: 'Sold Out',
      comingSoon: 'Coming Soon'
    },

    // Backpack related
    backpack: {
      title: 'Backpack',
      itemName: 'Item Name',
      itemCount: 'Item Count',
      itemDescription: 'Item Description',
      itemImage: 'Item Image',
      itemType: 'Item Type',
      itemRarity: 'Rarity',
      itemEffect: 'Item Effect',
      useItem: 'Use Item',
      useConfirm: 'Confirm Use',
      useSuccess: 'Use Success',
      useFailed: 'Use Failed',
      itemUsed: 'Item Used',
      itemExpired: 'Item Expired',
      itemInvalid: 'Item Invalid',
      emptyBackpack: 'Backpack Empty',
      backpackFull: 'Backpack Full'
    },

    // Profile
    profile: {
      title: 'Profile',
      settings: 'Settings',
      language: 'Language',
      theme: 'Theme',
      notification: 'Notification',
      privacy: 'Privacy',
      about: 'About',
      version: 'Version',
      feedback: 'Feedback',
      help: 'Help',
      logout: 'Logout',
      login: 'Login',
      register: 'Register',
      username: 'Username',
      email: 'Email',
      phone: 'Phone',
      avatar: 'Avatar',
      nickname: 'Nickname',
      gender: 'Gender',
      birthday: 'Birthday',
      location: 'Location',
      bio: 'Bio',
      male: 'Male',
      female: 'Female',
      other: 'Other',
      editProfile: 'Edit Profile',
      saveProfile: 'Save Profile',
      profileSaved: 'Profile Saved',
      profileSaveFailed: 'Save Failed'
    },

    // Settings
    settings: {
      title: 'Settings',
      general: 'General',
      appearance: 'Appearance',
      language: 'Language Settings',
      languageTip: 'Choose app display language',
      theme: 'Theme Settings',
      themeTip: 'Choose app theme',
      light: 'Light',
      dark: 'Dark',
      auto: 'Auto',
      notification: 'Notification Settings',
      notificationTip: 'Manage app notifications',
      sound: 'Sound',
      vibration: 'Vibration',
      badge: 'Badge',
      privacy: 'Privacy Settings',
      privacyTip: 'Manage privacy options',
      dataUsage: 'Data Usage',
      analytics: 'Analytics',
      about: 'About App',
      aboutTip: 'View app information',
      version: 'Version',
      copyright: 'Copyright',
      terms: 'Terms of Service',
      privacy: 'Privacy Policy',
      feedback: 'Feedback',
      feedbackTip: 'Send us feedback or suggestions',
      help: 'Help Center',
      helpTip: 'View usage help',
      logout: 'Logout',
      logoutTip: 'Logout current account',
      logoutConfirm: 'Confirm Logout',
      logoutConfirmText: 'Are you sure you want to logout?'
    }
  }
}

// 创建响应式的当前语言状态
const currentLocale = ref(getCurrentLocale())

// 获取当前语言
function getCurrentLocale() {
  try {
    return uni.getStorageSync(STORAGE_KEY) || 'zh'
  } catch (e) {
    return 'zh'
  }
}

// 设置语言
function setLocale(locale) {
  try {
    uni.setStorageSync(STORAGE_KEY, locale)
    currentLocale.value = locale
    // 触发语言变化事件
    uni.$emit('localeChanged', locale)
  } catch (e) {
    console.error('Failed to save locale:', e)
  }
}

// 响应式翻译函数
function t(key, params = {}) {
  const keys = key.split('.')
  let value = messages[currentLocale.value]
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k]
    } else {
      console.warn(`Translation key not found: ${key} in locale: ${currentLocale.value}`)
      return key
    }
  }
  
  // 处理参数替换
  if (typeof value === 'string' && Object.keys(params).length > 0) {
    Object.keys(params).forEach(param => {
      value = value.replace(`{${param}}`, params[param])
    })
  }
  
  return value || key
}

// 获取支持的语言列表
function getSupportedLocales() {
  return [
    { code: 'zh', name: '中文', nativeName: '中文' },
    { code: 'en', name: 'English', nativeName: 'English' }
  ]
}

// 创建响应式的i18n实例
function createI18n() {
  return {
    t,
    locale: currentLocale,
    setLocale,
    getLocale: () => currentLocale.value,
    getSupportedLocales
  }
}

// 全局i18n实例
const i18n = createI18n()

export {
  t,
  setLocale,
  getCurrentLocale,
  getSupportedLocales,
  createI18n,
  i18n,
  currentLocale
} 