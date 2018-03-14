!(function() {
	'use strict';
	angular.module('frame')
		.directive('visible', function() {
			return {
				restrict: 'AE',
				templateUrl: 'directive/flow/visible/visible.template.html',
				scope: {
					userData: '=',
					resolve: '<',
					close: "&",
					dismiss: "&"
				},
				controller: ['$scope', '$uibModal', function($scope, $uibModal) {
					//执行人来源
					$scope.chooseType = [{
							name: '部门',
							type: 'dept'
						},
						{
							name: '职务',
							type: 'post'
						}, {
							name: '船舶',
							type: 'ship'
						}, {
							name: '岸基',
							type: 'land'
						}, {
							name: '公司通用',
							type: 'company'
						}
					]
					//监听执行人变化, 清除职务或者部门里面的数据
					$scope.deleValue = function() {
						$scope.userData[6].data.value = [];
					}
					//选取值
					$scope.choosePerson = function(params) {
						if($scope.userData[6].data.type == 'dept') {
							//选择部门
							var appendTo = angular.element(event.currentTarget).parent();
							$uibModal.open({
									backdrop: 'static',
									animation: true,
									appendTo: appendTo,
									component: 'lsmDepartmentSelection',
									resolve: {
										params: function() {
											return params;
										}
									}
								})
								.result.then(
									function(value) {
										console.log(value);
										$scope.userData[6].data.value = value;
									},
									function(value) {

									}
								);
						} else if($scope.userData[6].data.type == 'post') {
							//选择职务
							var appendTo = angular.element(event.currentTarget).parent();
							$uibModal.open({
									backdrop: 'static',
									animation: true,
									appendTo: appendTo,
									component: 'lsmPostSelection',
									resolve: {
										params: function() {
											return params;
										}
									}
								})
								.result.then(
									function(value) {
										$scope.userData[6].data.value = value;
									},
									function(value) {

									}
								);
						} else {
							return;
						}

					};
					// 删除部门或者职务
					$scope.delsprbd = function(index) {
						$scope.userData[6].data.value.splice(index, 1);
					}


				}]
			}
		});
})()