<template>
  <view class="profile-page">
    <view class="header">
      <text class="title">{{ t('profile.title') }}</text>
    </view>

    <view class="menu-list">
      <view class="menu-item" @click="goToBackpack">
        <view class="menu-icon">🎒</view>
        <view class="menu-info">
          <text class="menu-title">{{ t('backpack.title') }}</text>
          <text class="menu-desc">{{ t('backpack.title') }}</text>
        </view>
        <view class="menu-arrow">></view>
      </view>
      <view class="menu-item" @click="goToMallManage">
        <view class="menu-icon">🏪</view>
        <view class="menu-info">
          <text class="menu-title">{{ t('mall.title') }}</text>
          <text class="menu-desc">{{ t('mall.title') }}</text>
        </view>
        <view class="menu-arrow">></view>
      </view>

      <view class="menu-item" @click="goToLanguage">
        <view class="menu-icon">🌐</view>
        <view class="menu-info">
          <text class="menu-title">{{ t('settings.language') }}</text>
          <text class="menu-desc">{{ t('settings.languageTip') }}</text>
        </view>
        <view class="menu-arrow">></view>
      </view>

      <view class="menu-item">
        <view class="menu-icon">⚙️</view>
        <view class="menu-info">
          <text class="menu-title">{{ t('settings.title') }}</text>
          <text class="menu-desc">{{ t('settings.general') }}</text>
        </view>
        <view class="menu-arrow">></view>
      </view>

      <view class="menu-item" @click="goToStatistics">
        <view class="menu-icon">📊</view>
        <view class="menu-info">
          <text class="menu-title">{{ t('statistics.title') }}</text>
          <text class="menu-desc">{{ t('statistics.title') }}</text>
        </view>
        <view class="menu-arrow">></view>
      </view>
    </view>
  </view>
</template>

<script setup lang="js">
  import { onMounted, onUnmounted, watch } from 'vue';
  import { onShow } from '@dcloudio/uni-app';
  import { useScore } from '@/composables/useScore.js';
  import { useI18n } from '@/composables/useI18n.js';
  let languageChangeFlag = false;
  onShow(() => {
    if (languageChangeFlag) {
      uni.setNavigationBarTitle({
        title: t('profile.title'),
      });
      languageChangeFlag = false;
    }
  });
  const { t, locale } = useI18n();
  const { score } = useScore();

  // 响应式更新导航栏标题和tabbar
  function updateI18nUI() {
    uni.setNavigationBarTitle({
      title: t('profile.title'),
    });
  }
  let localeChangeHandler = null;
  onMounted(() => {
    // 监听语言变化事件
    localeChangeHandler = (locale) => {
      console.log('任务列表页面收到语言变化事件:', locale);
      languageChangeFlag = true;
    };

    uni.$on('localeChanged', localeChangeHandler);
    // 设置页面标题
    uni.setNavigationBarTitle({
      title: t('profile.title'),
    });
  });

  onUnmounted(() => {
    uni.$off('localeChanged', updateI18nUI);
  });

  // 如果你的useI18n提供了响应式locale，可以直接watch
  if (locale && typeof locale === 'object' && 'value' in locale) {
    watch(
      () => locale.value,
      () => {
        updateI18nUI();
      }
    );
  }

  function goToBackpack() {
    uni.navigateTo({
      url: '/pages/backpack/backpack',
    });
  }

  function goToMallManage() {
    uni.navigateTo({
      url: '/pages/profile/mall-manage',
    });
  }

  function goToLanguage() {
    uni.navigateTo({
      url: '/pages/profile/language',
    });
  }

  function goToStatistics() {
    console.log('点击统计按钮');
    uni.navigateTo({
      url: '/pages/statistics/statistics',
      success: () => {
        console.log('跳转成功');
      },
      fail: (err) => {
        console.error('跳转失败:', err);
        uni.showToast({
          title: t('error.operationFailed'),
          icon: 'none',
        });
      },
    });
  }
</script>

<style lang="scss" scoped>
  .profile-page {
    min-height: 100vh;
    background: #f7f8fa;

    .header {
      padding: 32rpx 24rpx 24rpx 24rpx;
      background: #fff;
      border-bottom: 2rpx solid #f0f0f0;

      .title {
        font-size: 44rpx;
        font-weight: bold;
        color: #222;
      }
    }

    .menu-list {
      padding: 24rpx;

      .menu-item {
        display: flex;
        align-items: center;
        background: #fff;
        border-radius: 16rpx;
        padding: 32rpx 24rpx;
        margin-bottom: 20rpx;
        box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
        transition: all 0.2s ease;

        &:active {
          transform: scale(0.98);
          box-shadow: 0 1rpx 6rpx rgba(0, 0, 0, 0.08);
        }

        .menu-icon {
          font-size: 48rpx;
          margin-right: 24rpx;
        }

        .menu-info {
          flex: 1;

          .menu-title {
            font-size: 32rpx;
            font-weight: 600;
            color: #222;
            margin-bottom: 8rpx;
            display: block;
          }

          .menu-desc {
            font-size: 24rpx;
            color: #888;
            display: block;
          }
        }

        .menu-arrow {
          font-size: 32rpx;
          color: #ccc;
          margin-left: 16rpx;
        }
      }
    }
  }
</style>
