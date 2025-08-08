// tabBar国际化工具
import { t, currentLocale } from './i18n.js';

// 定义tabBar页面路径
const TABBAR_PAGES = [
  'pages/task-list/task-list',
  'pages/score-mall/score-mall',
  'pages/profile/profile',
];

// 检查当前页面是否是tabBar页面
function isCurrentPageTabBar() {
  const pages = getCurrentPages();
  if (pages.length === 0) return false;

  const currentPage = pages[pages.length - 1];
  const currentPath = currentPage.route;

  console.log('当前页面路径:', currentPath);
  console.log('tabBar页面列表:', TABBAR_PAGES);
  console.log('是否当前页面是tabBar页面:', TABBAR_PAGES.includes(currentPath));

  return TABBAR_PAGES.includes(currentPath);
}

// 更新tabBar文本
function updateTabBarTexts() {
  console.log('更新tabBar文本，当前语言:', currentLocale.value);

  // 检查当前页面是否是tabBar页面
  if (!isCurrentPageTabBar()) {
    console.log('当前页面不是tabBar页面，跳过tabBar更新');
    return;
  }

  try {
    // 设置tabBar文本
    uni.setTabBarItem({
      index: 0,
      text: t('tabBar.taskList'),
      success: () => {
        console.log('tabBar[0] 更新成功:', t('tabBar.taskList'));
      },
      fail: (err) => {
        console.error('tabBar[0] 更新失败:', err);
      },
    });

    uni.setTabBarItem({
      index: 1,
      text: t('tabBar.scoreMall'),
      success: () => {
        console.log('tabBar[1] 更新成功:', t('tabBar.scoreMall'));
      },
      fail: (err) => {
        console.error('tabBar[1] 更新失败:', err);
      },
    });

    uni.setTabBarItem({
      index: 2,
      text: t('tabBar.profile'),
      success: () => {
        console.log('tabBar[2] 更新成功:', t('tabBar.profile'));
      },
      fail: (err) => {
        console.error('tabBar[2] 更新失败:', err);
      },
    });
  } catch (error) {
    console.error('更新tabBar时发生错误:', error);
  }
}

// 监听语言变化
function initTabBarI18n() {
  // 延迟初始化，确保应用完全加载
  setTimeout(() => {
    updateTabBarTexts();
  }, 100);

  // 监听语言变化事件
  uni.$on('localeChanged', (locale) => {
    console.log('语言变化事件触发:', locale);
    // 延迟更新，确保语言切换完成
    setTimeout(() => {
      updateTabBarTexts();
    }, 200);
  });
}

export { updateTabBarTexts, initTabBarI18n };
