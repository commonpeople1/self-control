<script>
import { initTabBarI18n, updateTabBarTexts } from './utils/tabBarI18n.js'

export default {
	onLaunch: function() {
		console.log('App Launch')
		initTabBarI18n()
	},
	onShow: function() {
		console.log('App Show')
	},
	onHide: function() {
		console.log('App Hide')
	},
	// 添加全局语言变化监听
	onLoad: function() {
		// 监听语言变化事件
		uni.$on('localeChanged', (locale) => {
			console.log('App收到语言变化事件:', locale)
			// 延迟更新tabBar
			setTimeout(() => {
				// 获取当前页面栈
				const pages = getCurrentPages()
				if (pages.length > 0) {
					const currentPage = pages[pages.length - 1]
					const currentPath = currentPage.route
					
					// 如果当前页面是tabBar页面，直接更新
					const tabBarPages = ['pages/task-list/task-list', 'pages/score-mall/score-mall', 'pages/profile/profile']
					if (tabBarPages.includes(currentPath)) {
						console.log('当前是tabBar页面，直接更新tabBar')
						updateTabBarTexts()
					} else {
						console.log('当前不是tabBar页面，跳转到tabBar页面更新')
						// 跳转到任务列表页面来更新tabBar
						uni.switchTab({
							url: '/pages/task-list/task-list',
							success: () => {
								setTimeout(() => {
									updateTabBarTexts()
								}, 100)
							}
						})
					}
				}
			}, 200)
		})
	}
}
</script>

<style>
	/*每个页面公共css */
</style>
