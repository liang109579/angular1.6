!(function(){'use strict';
	angular.module('frame') 
	.directive('officer', function() {
		return {
			restrict: 'AE',
			templateUrl: 'directive/flow/processSettings/processSettings.template.html',
			scope: {
				datas: "=",
				userData: '='
			},
			controller:['$scope', 'SIGN', function ($scope,SIGN) {
				$scope.reportList = [];// 台账列表
				SIGN.get('company/companyLedgerCfg','')
					.then(function(data){
						var reportArr = JSON.parse(data.ledgerCfg);
						$scope.reportList = [];
						for(var i =0; i < reportArr.length; i++){
							if(reportArr[i].open == undefined){
								$scope.reportList.push(reportArr[i].name);
							}
						}
					},function(err){
						console.log(err);
					})
					.catch(function(err){
						console.log(err)
					})
				
				$scope.isId = getPar('id');
				function getPar(par){
					//获取当前URL
					var local_url = document.location.href; 
					//获取要取得的get参数位置
					var get = local_url.indexOf(par +"=");
					if(get == -1){
						return false;   
					}    else {
						return true;
					}
					//截取字符串
					var get_par = local_url.slice(par.length + get + 1);    
					//判断截取后的字符串是否还有其他get参数
					var nextPar = get_par.indexOf("&");
					if(nextPar != -1){
						get_par = get_par.slice(0, nextPar);
					}
					return get_par;
				}
				
			}]
		}
	});  
})()
