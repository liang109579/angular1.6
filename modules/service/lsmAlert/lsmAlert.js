/**
 * by rufeng
 * data 2017-11-03
 */

angular.module("lsmAlertModule", []).
factory("lsmAlert", [function() {
	"use strict";
    return {
        confirm: function(title,success,error) {
            layer.confirm(title, {
                btn: ['确定', '取消'] //按钮
            },function(){
            	success();
            },function(){
            	error();
            });
        }
    };
}]);