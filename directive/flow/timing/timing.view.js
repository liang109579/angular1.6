!(function() {
	'use strict';
	angular.module('frame')
		.directive('timing', function() {
			return {
				restrict: 'AE',
				templateUrl: 'directive/flow/timing/timing.template.html',
				scope: {
					userData: '=',
					resolve: '<',
					close: "&",
					dismiss: "&"
				},
				controller: ['$scope', function($scope) {
					//取出定时设置的数组数据,同步更新
					$scope.schedule = $scope.userData[5].schedule;

					$scope.yearList = [{
						val: '1',
						key: '每年'
					}, {
						val: '2',
						key: '每2年'
					}, {
						val: '3',
						key: '每3年'
					}];
					$scope.monthList = [{
						val: 'month',
						key: '每月'
					}, {
						val: 'halfMonth',
						key: '每半个月'
					}, {
						val: 'quarter',
						key: '每3个月'
					}, {
						val: 'halfYear',
						key: '每6个月'
					}];

					$scope.isTime = function(n) {
						if(n == 0) {
							$scope.schedule.type = false;
						} else {
							$scope.schedule.type = true;
						}
					}

				}]
			}
		});
})()