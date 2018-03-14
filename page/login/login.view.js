/* 
	router data define
	author: lianglifeng
	E-mail: lianglf@alhigh.com.cn
	time: 2017.4.5
 */
!(function() {
	'use strict';
	angular.module('login', ['ui.router']);
	angular.module('login')
		.config(['$stateProvider', function($stateProvider) {

			$stateProvider
				// 在这里添加url路由
				.state('login', {
					title: '登录',
					url: '/login',
					templateUrl: 'page/login/login.template.html',
					controller: ['$scope', '$timeout', '$interval', 'SIGN', 'ConfigData', '$state', function($scope, $timeout, $interval, SIGN, ConfigData, $state) {
					

					}]
				});

		}]);
})()