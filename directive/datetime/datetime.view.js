!(function() {
	'use strict';
	angular.module('frame')
		.directive('dateTime', function() {
			return {
				restrict: 'AE',
				templateUrl: 'directive/datetime/datetime.template.html',
				scope: {
					datacont: '=',
					act: '='
				},
				controller: ['$scope', '$timeout', function($scope, $timeout) {
					if($scope.act == 'set') {
						if($scope.datacont == undefined) {
							$scope.datacont = {
								effectiveDate: ''
							}
						}
						//日期时间
						$timeout(function() {
							laydate.render({
								elem: '#time', //指定元素
								type: 'datetime',
								value: $scope.datacont.effectiveDate,
								trigger: 'click',
								format: 'yyyy-MM-dd HH:mm:ss',
								done: function(value, date, endDate) {
									console.log(value); //得到日期生成的值，如："2017-08-18 12:30:20"
									$scope.datacont.effectiveDate = value;
								}
							});
						}, 200)
					} else {

					}
				}]
			}
		});
})()