!(function() {
	'use strict';
	angular.module('frame')
		.directive('approve', function() {
			return {
				restrict: 'AE',
				templateUrl: 'directive/flow/approve/approve.template.html',
				scope: {
					userData: '=',
					resolve: '<',
					close: "&",
					dismiss: "&"
				},
				controller: ['$scope', '$uibModal', 'lsmSpliceString', 'SIGN', function($scope, $uibModal, lsmSpliceString, SIGN) {
					$scope.selectDataS = [];
					// 11总情况后面的下拉列表
					var userDatas = $scope.userData[1].form;
					refData();

					function refData() {
						$scope.selectData = [];
						if(userDatas.length > 0) {
							for(var i = 0; i < userDatas.length; i++) {
								if(userDatas[i].text) {
									$scope.selectData.push(userDatas[i].text);
								}
							}
						}
					}
					//监听审批人变化, 清除职务或者部门
					$scope.deleChoose = function(index) {
						// 控制显示带弹窗的部门还是带下拉列表的框
						if($scope.nodeList[index].type == 'dept' || $scope.nodeList[index].type == 'post' || $scope.nodeList[index].type == 'user' || $scope.nodeList[index].type == 'leader' || $scope.nodeList[index].type == 'emp') {
							$scope.nodeList[index].selectData = [];
							$scope.nodeList[index].processName = "";
							$scope.nodeList[index].use = "";
						} else if($scope.nodeList[index].type == 'procDept' || $scope.nodeList[index].type == 'procPost' || $scope.nodeList[index].type == 'procLeader' || $scope.nodeList[index].type == 'procEmp' || $scope.nodeList[index].type == 'procUser' || $scope.nodeList[index].type == 'procDeptLeaderByPost') {
							if(!$scope.selectData.length) {
								$scope.nodeList[index].type = 'dept';
								layer.msg("流程中无数据！！")
							} else {
								$scope.nodeList[index].selectData = [];
								$scope.nodeList[index].processName = "";
								if(userDatas.length > 0) {
									for(var i = 0; i < userDatas.length; i++) {
										if(userDatas[i].text) {
											$scope.nodeList[index].selectData.push(userDatas[i].text);
										}
									}
									$scope.nodeList[index].use = $scope.nodeList[index].selectData[0]
								}
							}
						} else if($scope.nodeList[index].type == 'process') {
							SIGN.get('processConfig/usingProcDefList','').then(function(data){
								console.log(data);
								if(data.length < 1){
									$scope.nodeList[index].type = 'dept';
									layer.msg("无流程可用！！")
								} else {
									for(var i = 0; i<data.length;i++){
										$scope.nodeList[index].selectDataS.push(data[i].name);
									}
									$scope.nodeList[index].processName = $scope.nodeList[index].selectDataS[0];
									httpList(index,$scope.nodeList[index].processName);
								}
								
							}).catch(function(err){
								
							})
						} else if( $scope.nodeList[index].type == 'superiorLeader'){
							$scope.nodeList[index].approverConditionRadio = 0;
							$scope.nodeList[index].valueCondition = {};
						}
						$scope.nodeList[index].value = [];
					}
					// 监听审批人数据来源
					$scope.dataSource = function(index) {
						if(!$scope.selectData.length && $scope.nodeList[index].valueCondition.src == 'process') {
							layer.msg("流程中无数据！！")
							$scope.nodeList[index].valueCondition.src = 'starterDept';
						}
					}
					// 监听流程名称变化
					function httpList(index,name){
						SIGN.get('processConfig/selectProcDefFormByName',{procDefName:name})
							.then(function(data){
								console.log(name);
								var form = window.eval('('+data.form+')');
								console.log(form);
								$scope.nodeList[index].selectData = [];
								for(var i = 0; i<form.length;i++){
									if(form[i].text){
										$scope.nodeList[index].selectData.push(form[i].text);
									}
								}
								$scope.nodeList[index].use = $scope.nodeList[index].selectData[0]
							},function(err){
								console.log(err);
							})
							.catch(function(err){
								console.log(err);
							})
					}
					// 监听流程名称变化
					$scope.appChage =function (index,name){
						httpList(index,name); 
					}
					//添加审批节点
					$scope.selectAndRadio = {
						chooseType: [{
							name: '部门',
							type: 'dept'
						}, {
							name: '职务',
							type: 'post'
						}, 
//						{
//							name: '指定人员',
//							type: 'user'
//						}, 
						{
							name: '部门领导',
							type: 'leader'
						}, {
							name: '部门非领导',
							type: 'emp'
						}, {
							name: '申请人直属领导',
							type: 'superiorLeader'
						},{
							name: '数据流程中的部门',
							type: 'procDept'
						}, {
							name: '流程中的职务',
							type: 'procPost'
						}, {
							name: '流程中寻找',
							type: 'process'
						}, {
							name: '数据流程中的部门领导',
							type: 'procLeader'
						}, {
							name: '数据流程中的部门非领导',
							type: 'procEmp'
						}, {
							name: '流程数据中指定的人员',
							type: 'procUser'
						},{
							name: '流程中的职务查找部门领导',
							type: 'procDeptLeaderByPost'
						}], //审批人类别
						approverCondition: {
							dataSources: [{
								name: '当前配置流程流程数据',
								value: 'process'
							}, {
								name: '申请人的部门',
								value: 'starterDept'
							}, {
								name: '申请人的职务',
								value: 'starterPost'
							},{
								name: '申请人所在船舶',
								value: 'starterShip'
							}], //审批人数据来源
							useName: [{
								name: '船舶'
							}, {
								name: '类型'
							}, {
								name: '部门'
							}, {
								name: '年度'
							}], //使用名称
							judgmentMode: [{
								name: '等于',
								value: '='
							}, {
								name: '不等于',
								value: '!='
							}, {
								name: '大于',
								value: '>'
							}, {
								name: '小于',
								value: '<'
							},{
								name: '包含',
								value: 'in'
							}],
							judgmentValue: '',
							isLast: [{
								name: '是',
								value: '0'
							}, {
								name: '否',
								value: '1'
							}]
						},
						visibleField: ['船舶', '类型', '部门', '年度', {
							name: '计划表',
							cols: [],
							rows: [1, 2]
						}],
						selectionCondition: {
							dataSources: [{
								name: '申请人',
								value: 'starter'
							}, {
								name: '公司',
								value: 'company'
							}], // 数据来源
							useName: [{
								name: '船舶'
							}, {
								name: '类型'
							}, {
								name: '部门'
							}, {
								name: '年度'
							}], //使用名称
							seekingWay: ['最近上级', '最近下级', '所有下级'], // 寻找方式 
						},
					}

					$scope.submitState = false;
					$scope.nodeList = $scope.userData[3].data;
					$scope.addNode = function() {
						var approvalNode = {
							selectDataS:[],// 存储用户选择的流程, 列表用来渲染
							selectData:[],// 渲染字段
							level: 1, // 审批等级
							approverConditionRadio: 0, // 设定审批人筛选条件
							passingCondition: '', //比例
							src: "company", // starter：申请人、company：公司
							direction: "subs", //查找方式 up: 最近上级、down：最近下级  如果数据来源是公司，那么查找方式只有subs: 所有下级
							type: "dept", // post：职务、dept：部门、user：指定人员(没有归属部门)、leader：部门领导、emp：非领导、procDept：数据流程中的部门、procPost：流程中的职务、process流程中寻找（---不是上一个流程，未知流程--） 、procLeader数据流程中的部门领导 、procEmp数据流程中的部门非领导、procUser流程数据中指定的人员
							processName: "", //当type=process时使用 这是流程名称 选取时间最近的一条数据 （组长查找）可直接找到人员
							use: "", // 当type为dept或post或process时使用
							value: [], // 支持多部门、多职务
							valueCondition: {},
							conditionRadio: 0, // 默认选取通过条件
							condition: 'all', // 通过条件 all、xx%（大于等于百分比）、数字（具体人数）
							adoptCondition: [{
									check: true,
									value: 'all'
								},
								{
									check: false,
									value: 0
								}, {
									check: false,
									value: 0
								}
							]

						};
						$scope.nodeList.push(approvalNode);
						$scope.submitState = true;
					}
					// 判断用户选择的开启时间
					$scope.radioCondition = function(index, n) {
						$scope.nodeList[index].condition = $scope.nodeList[index].adoptCondition[n].value;
						for (var i = 0; i < $scope.nodeList[index].adoptCondition.length; i++) {
							if(i != n){
								$scope.nodeList[index].adoptCondition[i].check = false;
							} else {
								$scope.nodeList[index].adoptCondition[i].check = true;
							}
						}
						if(n == 1) {
							$scope.nodeList[index].condition += '%';
						}
					}
					//判断是否清除valueCondition
					$scope.isValue = function(index, n) {
						if(n == 0) {
							$scope.nodeList[index].valueCondition = {};
						} else if(n == 1) {
							if($scope.nodeList[index].valueCondition.src == undefined){
								$scope.nodeList[index].valueCondition = {
									src: 'starterDept', //process：当前配置流程流程数据、starterDept申请人的部门，starterPost申请人的职务
									use: "", //使用名称：招聘职务   当 valueCondition 中的src 为流程中的相关 数据时 使用  
									operator: "=", //判断方式： ‘=’
									value: "", //用户填入值： 船长
								}
							}
						}
					}
					// 判断是否使用当前配置
					$scope.valueCon = function(index,src){
						if(src != 'process'){
							$scope.nodeList[index].valueCondition.use = "";
						} else {
							if($scope.selectData.length < 1 ){
								$scope.nodeList[index].valueCondition.src = 'starterDept';
								layer.msg('流程中无数据');
							} else {
								$scope.nodeList[index].valueCondition.use = $scope.selectData[0]
							}
						}
					}
					//删除审批节点
					$scope.remove = function(index) {
						$scope.nodeList.splice(index, 1);
						if($scope.nodeList.length == 0) {
							$scope.submitState = false;
						}
					}
					// 移动审批节点向上
				    $scope.goTop = function (index,event){
				    	if(index != 0){
				    		var obj =  $scope.nodeList[index];
				    		$scope.nodeList[index] = $scope.nodeList[index-1];
				    		$scope.nodeList[index-1] = obj;
				    	} else {
							layer.msg('当前审批节点已位于最顶部')
						}
				    }
				    // 移动审批节点向下
					$scope.goDown = function(index,event){
						if(index < $scope.nodeList.length - 1){
				    		var obj =  $scope.nodeList[index];
				    		$scope.nodeList[index] = $scope.nodeList[index+1];
				    		$scope.nodeList[index+1] = obj;
				    	} else {
							layer.msg('当前审批节点已位于最底部')
						}
					}
					
					//判断数据来源， 更改默认选项
					$scope.isDataSource = function(index) {
						if($scope.nodeList[index].src == 'company') {
							$scope.nodeList[index].direction = 'subs';
						}
					}
					//选取值
					$scope.choosePerson = function(event, index) {
						if($scope.nodeList[index].type == 'dept' || $scope.nodeList[index].type == 'leader' || $scope.nodeList[index].type == 'emp') {
							//选择部门
							var appendTo = angular.element(event.currentTarget).parent();
							$uibModal.open({
									backdrop: 'static',
									animation: true,
									appendTo: appendTo,
									component: 'lsmDepartmentSelection',
									resolve: {
										params: function() {
											return $scope.nodeList[index].value
										}
									}
								})
								.result.then(
									function(value) {
										$scope.nodeList[index].value = value;
									},
									function(value) {

									}
								);
						} else if($scope.nodeList[index].type == 'post' || $scope.nodeList[index].type == 'user') {
							//选择职务
							var appendTo = angular.element(event.currentTarget).parent();
							$uibModal.open({
									backdrop: 'static',
									animation: true,
									appendTo: appendTo,
									component: 'lsmPostSelection',
									resolve: {
										params: function() {
											return $scope.nodeList[index].value
										}
									}
								})
								.result.then(
									function(value) {
										console.log(value);
										$scope.nodeList[index].value = value;
									},
									function(value) {

									}
								);
						} else {
							return;
						}

					};
					// 删除审批人
					$scope.delsprbd = function(index, i) {
						$scope.nodeList[index].value.splice(i, 1);
					}
					//显示、隐藏可见数据
					$scope.fieldState = false;
					$scope.showField = function() {
						$scope.fieldState = !$scope.fieldState;
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

					//选择流程
					$scope.chooseProcess = function(index) {
						var appendTo = angular.element(event.currentTarget).parent();
						$uibModal.open({
								backdrop: 'static',
								animation: true,
								appendTo: appendTo,
								component: 'processList',
								resolve: {
									item: function() {

									}
								}
							})
							.result.then(
								function(value) {

								},
								function(value) {

								}
							);
					}

				}]
			}
		});
})()