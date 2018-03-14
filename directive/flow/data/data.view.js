!(function() {
	'use strict';
	angular.module('frame')
		.directive('data', function() {
			return {
				restrict: 'AE',
				templateUrl: 'directive/flow/data/data.template.html',
				scope: {
					userData: "=",
					save: "&"
				},
				controller: ['$scope', 'popup', '$uibModal', 'SIGN', function($scope, popup, $uibModal, SIGN) {
					$scope.formControls = $scope.userData[1].form;
					$scope.tabIndex = 0;
					$scope.tabShow = function(index) {
						$scope.tabIndex = index;
					}
					$scope.current = {}; //当前操作的动态控件
					// 存储表格数据包状态
					$scope.tableDataState = [];
					//添加控件
					$scope.addControl = function(type) {
						var control;
						switch(type) {
							case 1: //添加单行文本
								control = {
									src: "custom",
									type: 'show-input',
									text: '单行文本',
									required: false,
									minLength: 2,
									maxLength: 64,
									placeHolder: '提示文字',
									errorText: '错误提示文字',
									ledgerDisplay: true,
									level: 0
								};
								break;
							case 2: //添加多行文本
								control = {
									src: "custom",
									type: 'show-text',
									text: '多行文本',
									required: false,
									minLength: 2,
									maxLength: 200,
									placeHolder: '提示文字',
									errorText: '错误提示文字',
									ledgerDisplay: true,
									level: 0
								};
								break;
							case 3: //添加单选框
								control = {
									src: "custom",
									type: 'show-check',
									text: '单选',
									required: false,
									optionobj: {},
									optionarr: ['选项一', '选项二', '选项三'],
									option: '选项一,选项二,选项三',
									errorText: '错误提示文字',
									ledgerDisplay: true,
									level: 0
								};
								break;
							case 4: //添加多选框
								control = {
									src: "custom",
									type: 'show-checks',
									text: '多选',
									required: false,
									optionobj: {},
									optionarr: ['选项一', '选项二', '选项三'],
									option: '选项一,选项二,选项三',
									errorText: '错误提示文字',
									ledgerDisplay: true,
									level: 0
								};
								break;
							case 5: //添加下拉菜单
								control = {
									src: "custom",
									type: 'show-select',
									text: '下拉菜单',
									required: false,
									isUrl: false,
									url: '',
									optionobj: {},
									optionarr: ['选项一', '选项二', '选项三'],
									option: '选项一,选项二,选项三',
									ledgerDisplay: true,
									level: 0
								};
								break;
							case 6: //添加日期框
								control = {
									src: "custom",
									type: 'date-picker',
									text: '日期',
									required: false,
									format: '',
									ledgerDisplay: true,
									level: 0
								};
								break;
							case 7: //添加数字框
								control = {
									src: "custom",
									type: 'show-number',
									text: '数字',
									placeHolder: '提示文字',
									maxlength: 18,
									minlength: 0,
									required: false,
									ledgerDisplay: true,
									level: 0
								};
								break;
							case 8: //添加表格 功能需要扩展
								control = {
									isData: false, // true：启用, false: 不启用
									colOrRow: 'col', // col:列；row：行
									dataField: {},
									title: '',
									src: "custom",
									type: 'show-table',
									index: 0,
									rows: 3,
									cols: 4,
									content: [],
									level: 0
								};
								break;
							case 9: // 自定义表格 只填写表头
								control = {
									isData: false, // true：启用, false: 不启用
									dataField: {},
									title: '',
									src: "custom",
									type: "diy-table",
									cols: 2, // 表格列数
									rows: 4, // 表格行数
									content: [], // 表格内容
									ledgerDisplay: true,
									level: 0
								}
								break;
							case 10: //添加日期时间框
								control = {
									src: "custom",
									type: 'date-time',
									text: '带时间日期',
									required: false,
									format: '',
									ledgerDisplay: true,
									level: 0
								};
								break;
							case 11: //添加上传文件框
								control = {
									src: "custom",
									type: 'show-file',
									text: '上传文件',
									ledgerDisplay: true,
									isSystemCfg: 0, // 0 代表不是体系正文， 1 代表普通表格
									level: 0
								};
								break;
							case 12: //添加选择指定人员的输入框
								control = {
									src: "custom",
									type: 'show-appoint',
									text: '指定人员',
									required: false,
									ledgerDisplay: true,
									level: 0
								}
								break;
							case 13: //添加选择职务的输入框
								control = {
									src: "custom",
									type: 'show-post',
									text: '选择职务',
									required: false,
									ledgerDisplay: true,
									level: 0
								}
								break;
							case 14: //添加密码输入框
								control = {
									src: "custom",
									type: 'show-pasword',
									text: '输入密码',
									required: false,
									minLength: 6,
									maxLength: 16,
									placeHolder: '请输入密码,最少6位',
									errorText: '错误提示文字',
									ledgerDisplay: true,
									level: 0
								};
								break;
						}
						var arr = document.getElementsByClassName('overlight');
						for(var i = 0; i < arr.length; i++) {
							arr[i].classList.remove('overlight');
						}
						$scope.formControls.push(control);
						$scope.current = control;
						//切换到控件编辑
						$scope.tabIndex = 1;
					}

					//移除当前控件
					$scope.remove = function(index, event) {
						$scope.formControls.splice(index, 1);
						$scope.current = null;
						//切换到添加控件
						$scope.tabIndex = 0;
					}
					// 移动当前控件向上
					$scope.goTop = function(index, event) {
						$scope.current = null;
						if(index != 0) {
							var obj = new Object($scope.formControls[index]);
							$scope.formControls[index] = new Object($scope.formControls[index - 1]);
							$scope.formControls[index - 1] = obj;
						}
					}
					// 移动当前控件向下
					$scope.goDown = function(index, event) {
						$scope.current = null;
						if(index < $scope.formControls.length - 1) {
							var obj = $scope.formControls[index];
							$scope.formControls[index] = $scope.formControls[index + 1];
							$scope.formControls[index + 1] = obj;
						}
					}
					//点击选中某个控件项
					$scope.click = function(index, event) {
						//移除其他项高亮
						var arr = document.getElementsByClassName('overlight');
						for(var i = 0; i < arr.length; i++) {
							arr[i].classList.remove('overlight');
						}

						//当前点击项高亮
						event.currentTarget.classList.add('overlight');
						$scope.current = $scope.formControls[index];
						$scope.current['index'] = index;
						$scope.current['forme'] = "designPage";
						//切换到控件编辑
						$scope.tabIndex = 1;
						if($scope.current.type == 'diy-table' || $scope.current.type == 'show-table') {
							readyTable($scope.current);
						}
					}
					// 控制表格等级
					$scope.tableChange = function(lv, data) {
						console.log(lv, data);
						for(var i = 0; i < data.length; i++) {
							for(var j = 0; j < data[i].length; j++) {
								if(lv > data[i][j].level) {
									data[i][j].level = lv;
								}
							}
						}
					}
					// 控制表格行列改变
					$scope.tableContentBlur = function(ranks) {
						if($scope.current.rows < 1 || $scope.current.cols < 1) {
							layer.msg('行或列不得小于0')
							return;
						}
						readyTable($scope.current);
						removeDataField($scope.current)
						var objArr = [];
						if(ranks == 'row') {
							let num = Math.abs($scope.current.rows - $scope.current.content.length)
							if($scope.current.rows > $scope.current.content.length) {
								for(let i = 0; i < num; i++) {
									for(let j = 0; j < $scope.current.content[0].length; j++) {
										let obj = {
											type: "",
											data: "",
											level: 0
										}
										objArr.push(obj)
									}
									$scope.current.content.push(objArr);
									objArr = [];
								}
							} else if($scope.current.rows < $scope.current.content.length) {
								for(let i = 0; i < num; i++) {
									$scope.current.content.pop();
								}
							}
						} else if(ranks == 'col') {
							let num = Math.abs($scope.current.cols - $scope.current.content[0].length)
							if($scope.current.cols > $scope.current.content[0].length) {
								for(let i = 0; i < num; i++) {
									for(let j = 0; j < $scope.current.content.length; j++) {
										$scope.current.content[j].push({
											type: "",
											data: "",
											level: 0
										});
									}
								}
							} else if($scope.current.cols < $scope.current.content[0].length) {
								for(let i = 0; i < num; i++) {
									for(let j = 0; j < $scope.current.content.length; j++) {
										$scope.current.content[j].pop();
									}
								}
							}
						}
					}
					// 加减行列需要判断数据包是否绑定， 如果绑定的行或列被删除， 则删除数据包
					function removeDataField(table) {
						let max;
						if(!table.isData) {
							return;
						}
						if(table.colOrRow == 'col' || table.type == 'diy-table') {
							max = table.cols - 1;
						} else if(table.colOrRow == 'row') {
							max = table.rows - 1;
						}
						if(max < 0) {
							layer.msg('程序异常， 请刷新页面')
							return;
						}
						for(let k in table.dataField) {
							if(k > max) {
								delete table.dataField[k]
							}
						}
					}
					// 控制表格行业数输入值
					$scope.ranksChangeRow = function() {
						if($scope.current.rows < 1 || $scope.current.rows == undefined) {
							$scope.current.rows = 1;
						}
					}
					$scope.ranksChangeCol = function() {
						if($scope.current.cols < 1 || $scope.current.cols == undefined) {
							$scope.current.cols = 1;
						}
					}
					// 公司数据
					$scope.companyDataList = [];
					selsectUrl();

					function selsectUrl() {
						SIGN.post('selectElement/selectNoDepartmentStaff', '')
							.then(function(data) {
								console.log(data)
								if(data.code > 0) {
									$scope.companyDataList = data.data;
								}
							}, function(err) {
								console.log(err)
							})
							.catch(function(err) {
								console.log(err)
							})
					}

					// 判断用户是否使用公司数据
					$scope.selsectIsUrl = function(bol) {
						$scope.current.isUrl = bol;
						if(bol) {
							if($scope.current.url == '' || $scope.current.url == undefined) {
								$scope.current.url = $scope.companyDataList[0].value
							}
						} else {
							$scope.current.url = '';
							$scope.current.isUrl = false;
						}
					}
					//监听选项改变事件
					$scope.changeOption = function() {
						var option = $scope.current.option;
						if($scope.current.type == 'show-select') {
							if($scope.current.isUrl) {

							} else {
								var str = option.replace(/，/ig, ',');
								$scope.current.optionarr = str.split(','); //数据来源固定值	
							}
						} else { //将字符串转换数组保存
							var str = option.replace(/，/ig, ',');
							$scope.current.optionarr = str.split(','); //数据来源固定值	
						}
					}

					//数据包来源
					$scope.sourceList = []
					// 数据包
					$scope.dataPacket = [];
					// 获取数据包
					if($scope.sourceList.length < 1) {
						SIGN.get('processConfig/dataPackageList', '')
							.then(function(data) {
								$scope.sourceList = data;
							}, function(err) {
								console.log(err);
							})
							.catch(function(err) {
								console.log(err);
							})
					} else {

					}

					//数据包设定
					$scope.settingState = false;
					$scope.dataPkgId = '';
					$scope.showSetting = function() {
						$scope.dataPacket = []
						if($scope.dataPkgId != '' && $scope.dataPkgId != undefined && $scope.dataPkgId != null) {
							SIGN.get('processConfig/dataPackageDetail', {
									pkgId: $scope.dataPkgId
								})
								.then(function(data) {
									console.log(data)
									$scope.dataPacket = window.eval('(' + data.fieldConfig + ')');
									$scope.settingState = true;
								}, function(err) {
									console.log(err)
									$scope.settingState = false;
								})
								.catch(function(err) {
									console.log(err)
									$scope.settingState = false;
								})
						}
					}
					// 添加单个数据包
					$scope.onAddData = function(data) {
						for(var i = 0; i < $scope.formControls.length; i++) {
							if($scope.formControls[i].colName == data.colName && $scope.formControls[i].pkg_id == data.pkg_id) {
								layer.msg('已存在数据包');
								return;
							}
						}
						$scope.formControls.push(data);
					}
					//数据包全部添加
					$scope.chkAll = function() {
						var boln = true; // 假设没有相同的数据包字段
						for(var i = 0; i < $scope.dataPacket.length; i++) {
							for(var j = 0; j < $scope.formControls.length; j++) {
								if($scope.formControls[j].colName == $scope.dataPacket[i].colName && $scope.formControls[j].pkg_id == $scope.dataPacket[i].pkg_id) {
									boln = false;
									break;
								}
							}
							if(boln) {
								$scope.formControls.push($scope.dataPacket[i]);
							} else {
								boln = true;
							}
						}
					}

					//表格编辑窗口的打开
					$scope.openTableDesign = function(event, current) {
						var appendTo = angular.element(event.currentTarget).parent();
						$uibModal.open({
								backdrop: 'static',
								animation: true,
								appendTo: appendTo,
								component: 'openTableDesign',
								resolve: {
									currents: current
								}
							})
							.result.then(
								function(value) {
									// 表格设置返回数据
									$scope.formControls[index].content = value;
									console.log($scope.formControls)
								},
								function(value) {

								}
							);
					}
					// 自定义表格编辑窗口的打开
					$scope.openDiyTable = function(event, current) {
						console.log(current)
						var appendTo = angular.element(event.currentTarget).parent();
						$uibModal.open({
								backdrop: 'static',
								animation: true,
								appendTo: appendTo,
								component: 'openDiyTable',
								resolve: {
									currents: current
								}
							})
							.result.then(
								function(value) {
									// 表格设置返回数据
									console.log(value)
								},
								function(value) {

								}
							);
					}
					// 数据包字段储存
					$scope.dataWord = []

					// 表格数据包开启关闭设置
					$scope.switchs = function(table) {
						readyTable(table)
					}
					// 数据包更改实时获取数据包字段
					$scope.tableData = function(id) {
						SIGN.get('processConfig/dataPackageDetail', {
								pkgId: id
							})
							.then(function(data) {
								$scope.dataWord = JSON.parse(data.fieldConfig)
							}, function(err) {
								console.log(err)
							})
							.catch(function(err) {
								console.log(err)
							})
					}

					// 添加绑定
					$scope.addDataFile = function(table) {

						let obj = {
							colName: $scope.tableVariable.colName,
							pkg_id: $scope.tableVariable.pkg_id,
							isDisplay: $scope.tableVariable.isDisplay, // 是否显示
							value: $scope.tableVariable.value, // 默认值
							pkg_text: '', // 数据包名字
							colText: '', // 字段名字
						};

						if($scope.tableVariable.position == '' && $scope.tableVariable.position != 0) {
							layer.msg('请选择行或列');
							return;
						}
						if(obj.pkg_id == '' || obj.pkg_id == undefined) {
							layer.msg('请选择数据包');
							return;
						}
						if(obj.colName == '' || obj.colName == undefined) {
							layer.msg('请选择字段名称');
							return;
						}
						if(obj.isDisplay == false && (obj.value == '' || obj.value == undefined)) {
							layer.msg('不显示必须设置默认值');
							return;
						}
						// 获取数据包的名字
						for(let i = 0; i < $scope.sourceList.length; i++) {
							if(obj.pkg_id == $scope.sourceList[i].id) {
								obj.pkg_text = $scope.sourceList[i].packageName
							}
						}
						// 获取字段名字
						for(let i = 0; i < $scope.dataWord.length; i++) {
							if(obj.colName == $scope.dataWord[i].colName) {
								obj.colText = $scope.dataWord[i].text;
							}
						}

						table.dataField[$scope.tableVariable.position] = obj

						console.log(table.dataField);

						$scope.tableVariable = {
							position: '', // 行列
							isDisplay: true, // 是否显示
							pkg_id: '', // 数据包
							colName: '', // 字段
							value: '' // 默认值
						}
					}

					// 表格做准备
					/* 表格设置变量 */
					$scope.tableVariable = {
						position: '', // 行列
						isDisplay: true, // 是否显示
						pkg_id: '', // 数据包
						colName: '', // 字段
						value: '' // 默认值
					}
					// 数据包绑定行列切换
					$scope.colOrRow = function(table) {
						$scope.tableVariable = {
							position: '', // 行列
							isDisplay: true, // 是否显示
							pkg_id: '', // 数据包
							colName: '', // 字段
							value: '' // 默认值
						}
						table.dataField = {}
						readyTable(table)
					}
					$scope.positions = []; // 表格行或者列统计显示
					function readyTable(table) {
						$scope.positions = [];
						if(table.isData) {
							if(table.colOrRow == 'col' || table.type == 'diy-table') {
								for(let i = 0; i < table.cols - 1; i++) {
									$scope.positions[i] = {
										key: '第' + (i + 2) + '列',
										value: i + 1
									}
								}
							} else if(table.colOrRow == 'row') {
								for(let i = 0; i < table.rows - 1; i++) {
									$scope.positions[i] = {
										key: '第' + (i + 2) + '行',
										value: i + 1
									}
								}
							} else if(table.type == 'diy-table') {
								for(let i = 0; i < table.cols - 1; i++) {
									$scope.positions[i] = {
										key: '第' + (i + 2) + '列',
										value: i + 1
									}
								}
							}
						} else {
							table.dataField = {}
						}
					}
					// 删除全部绑定数据包
					$scope.removeDatas = function(table) {
						table.dataField = {}
					}
					// 删除单个绑定数据包
					$scope.removeData = function(key, table) {
						console.log(key, table)
						delete table.dataField[key];
					}

					//保存动态表单
					$scope.save = function() {
						$scope.userData[2].data = $scope.formControls;
						console.log('提交数据：', $scope.userData);
					}
					// 数据包默认值的问题：显示时清除默认值
					$scope.ordinary = function() {
						$scope.tableVariable.value = ''
					}

				}]
			}
		});
})()