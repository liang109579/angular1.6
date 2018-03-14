!(function() {
	'use strict';
	angular.module('frame')
		.directive('last', function() {
			return {
				restrict: 'AE',
				templateUrl: 'directive/flow/last/last.template.html',
				scope: {
					userData: '=',
					resolve: '<',
					close: "&",
					dismiss: "&"
				},
				controller: ['$scope', '$uibModal', 'SIGN', function($scope, $uibModal, SIGN) {
					//存储选择流程中的数据字段名，用作循环
					$scope.selectData = [];
					// 保存相等的数组， 传递指针
					$scope.processFollowList = $scope.userData[4].data;
					//执行人来源
					$scope.chooseType = [{
							name: '部门',
							type: 'dept'
						}, {
							name: '职务',
							type: 'post'
						},
						//{
						//	name: '指定人员',
						//	type: 'user'
						//}, 
						{
							name: '部门领导',
							type: 'leader'
						}, {
							name: '部门非领导',
							type: 'emp'
						}, {
							name: '申请人直属领导',
							type: 'superiorLeader'
						}, {
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
						}, {
							name: '流程中的职务查找部门领导',
							type: 'procDeptLeaderByPost'
						}
					];
					// 选择是部门还是职务
					$scope.selectedMode = 1;
					// 开启时间流程寻找
					$scope.selectTime = [];
					// 11总情况后面的下拉列表
					$scope.userDatas = $scope.userData[1].form;
					$scope.selectData = [];
					if($scope.userDatas.length > 0) {
						for(var i = 0; i < $scope.userDatas.length; i++) {
							if($scope.userDatas[i].text != undefined && $scope.userDatas[i].text != '' && $scope.userDatas[i].text != null) {
								$scope.selectData.push($scope.userDatas[i].text);
							}
							if($scope.userDatas[i].text && ($scope.userDatas[i].type == 'date-picker' || $scope.userDatas[i].type == 'date-time')) {
								$scope.selectTime.push($scope.userDatas[i].text);
							}
						}
					}

					// 触发事件时间， 需要用js动态获取本流程的数据设置
					$scope.triggerDate = [{
						name: '保存',
						value: 'save'
					}, {
						name: '提交',
						value: 'run'
					}, {
						name: '审批通过',
						value: 'agree'
					}];
					// var userDataLevel = $scope.userData[3].data;
					//	if(userDataLevel.length > 0) {
					//		var maxNum = 0;
					//		for(let i = 0; i < userDataLevel.length; i++) {
					//		  if(maxNum < userDataLevel[i].level) {
					//			maxNum = userDataLevel[i].level
					//		  }
					//		}
					//		for(let j = 1; j <= maxNum; j++) {
					//		  let obj = {
					//	        name: j + "级审批",
					//	        value: j
					//        }
					//        $scope.triggerDate.push(obj);
					//      }
					//  }
					$scope.refreshTrigger = function(index) {
						var obj = {
							name: '发送船员招聘站内信',
							value: 'crewRecruitNotice'
						};
						if($scope.processFollowList[index].state == 'agree' && $scope.processFollowList[index].executionMode.indexOf(obj) < 0) {
							$scope.processFollowList[index].type = 'newProcess';
							$scope.processFollowList[index].executionMode.push({
								name: '发送船员招聘站内信',
								value: 'crewRecruitNotice'
							})
						} else {
							$scope.processFollowList[index].type = 'newProcess';
							var j = -1;
							for(var i = 0; i < $scope.processFollowList[index].executionMode.length; i++) {
								if($scope.processFollowList[index].executionMode[i].value == 'crewRecruitNotice') {
									j = i;
									break;
								}
							}
							if(j >= 0 && $scope.processFollowList[index].state != 'agree') {
								$scope.processFollowList[index].executionMode.splice(j, 1);
							}
						}
					}
					// 执行方式
					$scope.pattern = function(index) {
						if($scope.processFollowList[index].type == 'crewRecruitNotice') {
							$scope.processFollowList[index].data.startTime.value = 0;
							$scope.processFollowList[index].data.startTimeNum = 0;
							$scope.processFollowList[index].data.dateItem = 1;
							$scope.processFollowList[index].data.selectIsNextTime = 'null';
							$scope.processFollowList[index].data.startTime.use = "";
						}
					}
					// 时间
					$scope.dates1 = [{
						key: '之前',
						value: '1'
					}, {
						key: '当天',
						value: '0'
					}]
					$scope.dates2 = [{
						key: '之后',
						value: '1'
					}, {
						key: '当天',
						value: '0'
					}]
					// 数据来源数组
					$scope.dataSources = [{
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
					}];
					$scope.dataCource = [{
						name: '申请人',
						value: 'starter'
					}, {
						name: '公司',
						value: 'company'
					}]
					// 开启时间数组
					$scope.goTime = [{
						name: '当前时间',
						value: 'null'
					}, {
						name: '流程数据',
						value: 'dataShoose'
					}]
					// 监听审批人数据来源
					$scope.dataSource = function(index) {
						console.log('condition')
						if(!$scope.selectData.length && $scope.processFollowList[index].data.condition.src == 'process') {
							layer.msg("流程中无数据！！")
							$scope.processFollowList[index].data.condition.src = 'starterDept';
						} else {
							$scope.processFollowList[index].data.condition.use = $scope.selectData[0]
						}
					}
					// 当选择流程数据时， 如果没有数据， 则返回当前时间
					$scope.goTimeTest = function(index) {
						if(!$scope.selectTime.length) {
							layer.msg("流程中无数据！！")
							$scope.processFollowList[index].data.selectIsNextTime = 'null';
							$scope.processFollowList[index].data.startTime.use = "";
							$scope.processFollowList[index].data.startTime.state = 'after'
						} else {
							$scope.processFollowList[index].data.startTime.use = $scope.selectTime[0]
						}
						if($scope.processFollowList[index].data.selectIsNextTime == 'null') {
							$scope.processFollowList[index].data.startTime.use = "";
						}
					}
					//添加后续流程
					$scope.submitState = false;
					$scope.addProcessFollow = function() {
						//数据格式
						var nextProcessData = {
							selectData: [], // 流程字段名
							selectDataS: [], // 流程数组
							selectDataN: [], // for数组
							executionMode: [{
									name: '新建流程',
									value: 'newProcess'
								},
								{
									name: '发送短信',
									value: 'message'
								},{
									name: '请假或出差',
									value: 'askLeaveOrBusiness'
								}
							],
							type: 'newProcess', //message：发送短信  newProcess:新建流程
							state: "save", // 前一个流程的流程状态: save：（保存（录入到db））、run（提交（发起流程））、1（第一级审批）..n（第N级审批）,
							data: {
								/** 流程设置 */
								name: "", // 流程名称(or id)，从后台获取，循环select//选择短信消失
								/** 自动开启流程并指派处理人 */
								starter: {
									src: "starter", // 数据来源 starter：申请人、company：公司								
									direction: "subs", // up: 最近上级、down：最近下级、 如果数据来源是公司，那么查找方式只有subs: 所有下级
									type: "dept", // 昨天的那个11种情况
									processName: "", //当type=process时使用 从后台获取流程， 然后把流程名称循环进select下拉列表
									use: "船舶名称",
									value: [], // 支持多部门、多职务
								},
								/** 开启时间 */
								dateItem: 1, // 判断是之后还是之前true:之前， false：之后
								selectIsNextTime: 'null', // 判断选取的是当前时间还是流程数据
								startTime: {
									use: "", // 如设置当前时间，此项可为null
									unit: "0", // "1":间隔执行； '0'：当天
									state: "after",// "after":之后； 'before'：之前
									value: {
										year:0,
										month:0,
										day:0
									}
								},
								startTimeNum: 0,
								/** 数据传递 ，选择短信时消失*/
								transferDatas: [{
									use: "", // 本流程表单中的内容
									for: "" // 等于流程中的数据字段， 如果没有就是空
								}],
								/** 开启条件 */
								condition: {},
								/** 短信设置----这个是流程内部的短信--比如： 一级审批完成 要发消息 给下一级审批人 */
								notice: ""
							},
							// 用来判断是否使用 condition 
							isContion: 0
						}
						$scope.processFollowList.push(nextProcessData);
						$scope.submitState = true;
					}
					// 寻找方法, 公司默认选择所有下级
					$scope.searchFn = function(val) {
						if(val.src != 'starter') {
							val.direction = "subs";
						}
					}
					//判断是否清除condition
					$scope.isValue = function(index, n) {
						if(n == 0) {
							$scope.processFollowList[index].data.condition = {};
						} else if(n == 1) {
							$scope.processFollowList[index].data.condition = {
								src: "starterDept", // process：上一个流程数据、starterDept申请人的部门，starterPost申请人的职务
								use: "", // 如果src使用starter，该项为null
								operator: "=", // 判断操作 =、>、<
								value: "" // 判断结果最终目标值，如上一个流程的申请人是否等于value的内容；或上一个流程表单中名为“培训人员”的控件内容是否等于value值等。
							}
						}
					}
					//删除后续流程
					$scope.remove = function(index) {
						$scope.processFollowList.splice(index, 1);
						if($scope.processFollowList.length == 0) {
							$scope.submitState = false;
						}
					}
					// 移动后续流程向上
					$scope.goTop = function(index) {
						if(index != 0) {
							var obj = $scope.processFollowList[index];
							$scope.processFollowList[index] = $scope.processFollowList[index - 1];
							$scope.processFollowList[index - 1] = obj;
						} else {
							layer.msg('当前后续流程已位于最顶部')
						}
					}
					// 移动后续流程向下
					$scope.goDown = function(index) {
						if(index < $scope.processFollowList.length - 1) {
							var obj = $scope.processFollowList[index];
							$scope.processFollowList[index] = $scope.processFollowList[index + 1];
							$scope.processFollowList[index + 1] = obj;
						} else {
							layer.msg('当前后续流程已位于最底部')
						}
					}

					// 控制执行时间是之前还是之后
					$scope.dateRp = function(index, n) {
						if(n == '+') {
							$scope.processFollowList[index].data.startTime.state = 'after'
						} else if(n == '-') {
							$scope.processFollowList[index].data.startTime.state = 'before'
						}
					}
					//执行方式
					$scope.executionMode = [{
							name: '新建流程',
							value: 'newProcess'
						},
						{
							name: '发送短信',
							value: 'message'
						}, {
							name: '发送站内消息',
							value: 'crewRecruitNotice'
						},{
							name: '请假或出差',
							value: 'askLeaveOrBusiness '
						}
					]
					// 开启条件数据来源数组
					$scope.conditionSrcArr = [{
						name: '申请人的职务',
						value: 'starterPost'
					}, {
						name: '申请人的部门',
						value: 'starterDept'
					}, {
						name: '本流程数据',
						value: 'process'
					}]
					// 删除执行人
					$scope.delsprbd = function(index, i) {
						$scope.processFollowList[index].data.starter.value.splice(i, 1);
					}
					//监听执行人变化, 清除职务或者部门里面的数据
					$scope.deleChoose = function(index) {
						// 控制显示带弹窗的部门还是带下拉列表的框
						if($scope.processFollowList[index].data.starter.type == 'dept' || $scope.processFollowList[index].data.starter.type == 'post' || $scope.processFollowList[index].data.starter.type == 'user' || $scope.processFollowList[index].data.starter.type == 'leader' || $scope.processFollowList[index].data.starter.type == 'emp') {
							//layer.msg("小于5了")
							$scope.processFollowList[index].data.starter.use = '';
							$scope.processFollowList[index].data.starter.processName = '';
							$scope.processFollowList[index].selectDataS = [];
						} else if($scope.processFollowList[index].data.starter.type == 'procDept' || $scope.processFollowList[index].data.starter.type == 'procPost' || $scope.processFollowList[index].data.starter.type == 'procLeader' || $scope.processFollowList[index].data.starter.type == 'procEmp' || $scope.processFollowList[index].data.starter.type == 'procUser' || $scope.processFollowList[index].data.starter.type == 'procDeptLeaderByPost') {
							if(!$scope.selectData.length) {
								$scope.processFollowList[index].data.starter.type = 'dept';
								layer.msg("流程中无数据！！")
							} else {
								if($scope.userDatas.length > 0) {
									$scope.processFollowList[index].selectData = [];
									for(var i = 0; i < $scope.userDatas.length; i++) {
										if($scope.userDatas[i].text) {
											$scope.processFollowList[index].selectData.push($scope.userDatas[i].text);
										}
									}
								}
								$scope.processFollowList[index].data.starter.processName = "";
								$scope.processFollowList[index].data.starter.use = $scope.processFollowList[index].selectData[0];
							}
						} else if($scope.processFollowList[index].data.starter.type == 'process') {
							// 需要从后台获取数据
							SIGN.get('processConfig/usingProcDefList', '')
								.then(function(data) {
									console.log(data);
									if(data.length < 1) {
										$scope.processFollowList[index].data.starter.type = 'dept';
										layer.msg("无流程可用！！")
										return;
									}
									$scope.processFollowList[index].selectDataS = [];
									for(var i = 0; i < data.length; i++) {
										$scope.processFollowList[index].selectDataS.push(data[i].name);
									}
									$scope.processFollowList[index].data.starter.processName = $scope.processFollowList[index].selectDataS[0];
									httpList(index, $scope.processFollowList[index].data.starter.processName);
								}).catch(function(err) {

								})
						}
						$scope.processFollowList[index].data.starter.value = [];
					}

					function httpList(index, name) {
						SIGN.get('processConfig/selectProcDefFormByName', {
								procDefName: name
							})
							.then(function(data) {
								console.log(name);
								var form = window.eval('(' + data.form + ')');
								console.log(form);
								$scope.processFollowList[index].selectData = [];
								for(var i = 0; i < form.length; i++) {
									if(form[i].text) {
										$scope.processFollowList[index].selectData.push(form[i].text);
									}
								}
								$scope.processFollowList[index].data.starter.use = $scope.processFollowList[index].selectData[0]
							}, function(err) {
								console.log(err);
							})
							.catch(function(err) {
								console.log(err);
							})
					}
					// 根据开启条件数据来源，控制是否显示本流程数据
					$scope.delconUse = function(index) {
						console.log($scope.processFollowList[index].data.condition);
						if($scope.processFollowList[index].data.condition.src == 'process') {
							if(!$scope.selectData.length) {
								layer.msg('本流程中无数据');
								$scope.processFollowList[index].data.condition.src = 'starterDept';
								$scope.processFollowList[index].data.condition.use = "";
							}

						}

					}
					// 选取值
					$scope.choosePerson = function(event, index) {
						if($scope.processFollowList[index].data.starter.type == 'dept' || $scope.processFollowList[index].data.starter.type == 'leader' || $scope.processFollowList[index].data.starter.type == 'emp') {
							//选择部门
							var appendTo = angular.element(event.currentTarget).parent();
							$uibModal.open({
									backdrop: 'static',
									animation: true,
									appendTo: appendTo,
									component: 'lsmDepartmentSelection',
									resolve: {
										params: function() {
											return $scope.processFollowList[index].data.starter.value
										}
									}
								})
								.result.then(
									function(value) {
										$scope.processFollowList[index].data.starter.value = value;
									},
									function(value) {

									}
								);
						} else if($scope.processFollowList[index].data.starter.type == 'post' || $scope.processFollowList[index].data.starter.type == 'user') {
							//选择职务
							var appendTo = angular.element(event.currentTarget).parent();
							$uibModal.open({
									backdrop: 'static',
									animation: true,
									appendTo: appendTo,
									component: 'lsmPostSelection',
									resolve: {
										params: function() {
											return $scope.processFollowList[index].data.starter.value
										}
									}
								})
								.result.then(
									function(value) {
										console.log(value);
										$scope.processFollowList[index].data.starter.value = value;
									},
									function(value) {

									}
								);
						} else {
							return;
						}

					};

					$scope.chooseProcess = function(index) {
						//console.log(index);
						//选择流程
						var appendTo = angular.element(event.currentTarget).parent();
						$uibModal.open({
								backdrop: 'static',
								animation: true,
								appendTo: appendTo,
								component: 'processList',
								resolve: {
									item: function() {
										//把流程名传递到弹窗
										return $scope.processFollowList[index].data.name;
									}
								}
							})
							.result.then(
								function(value) {
									if(value.name) {
										//把流程名称赋值
										$scope.processFollowList[index].data.name = value.name;
										// 如果流程中有数据字段， 则进行赋值
										SIGN.get('processConfig/selectProcDefFormByName', {
												procDefName: value.name
											})
											.then(function(data) {
												var form = window.eval('(' + data.form + ')');
												$scope.processFollowList[index].selectDataN = [];
												for(var i = 0; i < form.length; i++) {
													if(form[i].text) {
														$scope.processFollowList[index].selectDataN.push(form[i].text);
													}
												}
//												$scope.processFollowList[index].data.transferDatas[0].for = $scope.processFollowList[index].selectDataN[0];
											}, function(err) {
												console.log(err);
											})
											.catch(function(err) {
												console.log(err);
											})
									} else {
										layer.msg('请选择流程名')
									}

								},
								function(value) {

								}
							);
					}

					//判断方式
					$scope.judgmentMode = [{
							name: '等于',
							value: '='
						},
						{
							name: '不等于',
							value: '!='
						}, {
							name: '大于',
							value: '>'
						}, {
							name: '小于',
							value: '<'
						}

					]

					//传递数据
					$scope.parameter1 = [{
							name: '船舶1',
							value: '0'
						},
						{
							name: '类型1',
							value: '1'
						},
						{
							name: '部门1',
							value: '2'
						},
						{
							name: '年度1',
							value: '3'
						}
					]

					$scope.parameter2 = [{
							name: '船舶1',
							value: '0'
						},
						{
							name: '类型2',
							value: '1'
						},
						{
							name: '部门3',
							value: '2'
						},
						{
							name: '年度4',
							value: '3'
						}
					]

					//增加数据
					function pushData(index) {
						var field = {
							use: "", // 本流程表单中的内容
							for: "" // 等于name的值
						};
						$scope.processFollowList[index].data.transferDatas.push(field)
					}
					$scope.addData = function(index) {
						pushData(index);
					}
					// 监听流程名称变化
					$scope.appName = function(index, name) {
						httpList(index, name);
					}
					//删除数据
					$scope.delData = function(i, index) {
						$scope.processFollowList[i].data.transferDatas.splice(index, 1);
					}

				}]
			}
		});
})()