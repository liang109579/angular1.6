angular.module('processListModule', [])
	.directive("processList", function() {
		return {
			restrict: 'EA',
			scope: {
				resolve: '<',
				close: "&",
				dismiss: "&"
			},
			templateUrl: 'directive/flow/processList/processList_tpl.html',
			controller: ['$scope', 'lsmSpliceString', 'SIGN', function($scope, lsmSpliceString, SIGN) {
				$scope.searchList = [];
				$scope.processesList = [];
				$scope.Officer = {};
				SIGN.get('processConfig/usingProcDefList', '')
					.then(function(data) {
						$scope.processesList = data;
						$scope.searchList = data;
						for(let i = 0; i < data.length; i++) {
							if($scope.resolve.item == data[i].name) {
								$scope.Officer = data[i];
							}
						}

					}, function(err) {
						console.log(err);
					}).catch(function(err) {
						console.log(err);
					})

				// 搜索
				$scope.searchName = ''
				$scope.search = function() {
					$scope.searchList = [];
					for(var i = 0; i < $scope.processesList.length; i++){
						if($scope.processesList[i].name.indexOf($scope.searchName) > -1){
							$scope.searchList.push($scope.processesList[i])
						}
					}
				}
				$scope.keySearch = function(e) {
					//IE 编码包含在window.event.keyCode中，Firefox或Safari 包含在event.which中
					var keycode = window.event ? e.keyCode : e.which;
					if(keycode == 13) {//回车键：13
						$scope.search();
					}
				};
				// 选择流程
				$scope.okOff = function(i) {
					$scope.Officer = $scope.searchList[i];
				}
				$scope.save = function() {
					$scope.close({
						$value: $scope.Officer
					});
				};

				$scope.cancel = function() {
					$scope.dismiss({
						$value: ""
					});
				};

			}]
		};
	});