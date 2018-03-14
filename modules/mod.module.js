/*
	ng frame define
	auythor: liang lifeng
	E-mail: lianglf@allhigh.com.cn
	time: 2017.4.5
*/
!(function() {
	var theApp = angular.module('myApp', [
		'frame',
		'login',
		'companyApply',
		'ism',
		'invite',   //船员招聘模块
		'sailorLogin',//船员登录模块
		'ConfigData',
		'ui.router',
		'ui.tree',
		'ui.bootstrap',
		'myComponent',
		'ngLocale',
		'util.serviceModel',
		'validation',
		'validation.rule',
		'directiveModel',
		'ui.calendar'
	]);
	var _config = {
		title: '航运公司管理',
	

		setmeun: function(meunString) {
			
			_config.setTopMeun(_config.menuState.leftMeun);
			
		},

		setTopMeun: function(meun) {
			
		},
		menuDataLibrary: [
			{
				i: "fanew fanew-companysetup-other fanew-companysetup-icon",
				s: "公司设定",
				u: "cset",
				power: "1",
				sub: [{
					u: "base",
					s: "公司信息" 
				},{
					u: "depart",
					s: "部门管理",
					i: "sitemap"
				},{
					u: "officer",
					s: "职务管理", 
					i: "group"
				},{
					u: "user",
					s: "员工管理", 
					i: "user"
				}]
			}
		]

	};
	angular.module('ConfigData', []).value("ConfigData", _config);

	theApp.config(['$qProvider', function($qProvider) {
		$qProvider.errorOnUnhandledRejections(false);
	}]);

	theApp.config(['$locationProvider', '$urlRouterProvider', function($locationProvider, $urlRouterProvider) {
		$locationProvider.hashPrefix('');
		$urlRouterProvider.when('', 'login'); //当url为空
		$urlRouterProvider.otherwise('login'); //当url无法识别 
	}]);

	theApp.run(['$rootScope', "SIGN", "ConfigData", function($rootScope, SIGN, ConfigData) {
		$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
				
			setTitle(toState.title || ConfigData.title);
		});
	}]);

	// 设置页面标题
	function setTitle(title) {
		document.title = title;
		if(navigator.userAgent.indexOf("MicroMessenger") > 0) {
			// hack在微信等webview中无法修改document.title的情况
			var body = document.body,
				iframe = document.createElement('iframe');
			iframe.src = "/null.html";
			iframe.style.display = "none";
			iframe.onload = function() {
				setTimeout(function() {
						body.removeChild(iframe);
					},
					0
				);
			}
			body.appendChild(iframe);
		}
	}

})();