/* 
	main page define
	author: lianglifeng
	E-mail: lianglf@alhigh.com.cn
	time: 2017.4.5
 */
!(function() {
	'use strict';
	angular.module('frame', ['ui.router', 'ui.tree', 'ui.bootstrap']);
	angular.module('frame')
		.config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider) {
			$stateProvider
				// 在这里添加url路由
				.state('frame', {
					title: '菜单',
					url: '/frame',
					templateUrl: 'page/frame/frame.template.html',
					controller: ['$scope', 'SIGN', 'ConfigData', '$uibModal', miancon]
				});
		}]);

	function miancon($scope, SIGN, ConfigData, $uibModal) {
		
	}

})()