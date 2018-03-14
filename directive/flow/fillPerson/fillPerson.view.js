!(function() {
	'use strict';
	angular.module('frame')
		.directive('fill', function() {
			return {
				restrict: 'AE',
				templateUrl: 'directive/flow/fillPerson/fillPerson.template.html',
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
						$scope.userData[2].data.value = [];
					}
					//选取值
					$scope.choosePerson = function(params) {
						if($scope.userData[2].data.type == 'dept') {
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
										$scope.userData[2].data.value = value;
									},
									function(value) {

									}
								);
						} else if($scope.userData[2].data.type == 'post') {
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
										$scope.userData[2].data.value = value;
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
						$scope.userData[2].data.value.splice(index, 1);
					}

					// 设置填报人个数
					$scope.applyNum = [{
						key: "全部",
						value: "all"
					}, {
						key: "百分比",
						value: "%"
					}, {
						key: "人",
						value: "people"
					}]
					// 变换
					$scope.chageNum = function() {

					}

					//字段全选
					$scope.itemState = false;
					$scope.checkState = false;
					$scope.chkAll = function() {
						if($scope.checkState == false) {
							$scope.checkState = true;
							$scope.itemState = true;
						} else {
							$scope.checkState = false;
							$scope.itemState = false;
						}
					}

				}]
			}
		});
})()