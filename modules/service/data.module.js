/* 
    router data define
    author: lianglifeng
    E-mail: lianglf@alhigh.com.cn
    time: 2017.4.5
 */
'use strict';
(function(apiRoot) {
    angular.module('myApp')
        /**
         * 解决 post 问题
         */
        .config(["$httpProvider", function($httpProvider) {
            // Use x-www-form-urlencoded Content-Type
            $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

            /**
             * The workhorse; converts an object to x-www-form-urlencoded serialization.
             * @param {Object} obj
             * @return {String}
             */
            var param = function(obj) {
                var query = '',
                    name, value, fullSubName, subName, subValue, innerObj, i;

                for (name in obj) {
                    value = obj[name];

                    if (value instanceof Array) {
                        for (i = 0; i < value.length; ++i) {
                            subValue = value[i];
                            fullSubName = name + '[' + i + ']';
                            innerObj = {};
                            innerObj[fullSubName] = subValue;
                            query += param(innerObj) + '&';
                        }
                    } else if (value instanceof Object) {
                        for (subName in value) {
                            subValue = value[subName];
                            fullSubName = name + '[' + subName + ']';
                            innerObj = {};
                            innerObj[fullSubName] = subValue;
                            query += param(innerObj) + '&';
                        }
                    } else if (value !== undefined && value !== null)
                        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
                }

                return query.length ? query.substr(0, query.length - 1) : query;
            };

            // Override $http service's default transformRequest
            $httpProvider.defaults.transformRequest = [function(data) {
                return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
            }];
        }])


        .factory('SIGN', ['$http', '$state', "$q", function($http, $state, $q) {

            var tokentimespan = localStorage.getItem("tokentimespan");
            var token = localStorage.getItem("token");
			//hulang
            // var apiRoot = "http://192.168.20.122/ism/";
            // xuekaijie
//          var apiRoot = "http://192.168.10.144:9527/ism/";
            // caolufeng
            // var apiRoot = "http://192.168.20.119:8080/ism/";
            // console.log("token", localStorage.getItem("token"));
            // console.log("tokentimespan", localStorage.getItem("tokentimespan"));
            function postdata(url, data) {
                return httpService(url, data, 'POST');
            }

            function getdata(url, data) {
                // if (tokenPassed()) {
                //     gotoLogin();
                //     return $q.reject(0);
                // }
                return httpService(url, data, 'GET');
            }
            /**
             * [uploadFile 文件上传请求]
             * @param  {[type]} url  [url路径]
             * @param  {[type]} data [参数]
             * @return {[type]}      [description]
             */
            function uploadFile(url, data) {
                var deffers = $q.defer();
                $http({
                    method: 'POST',
                    url: apiRoot + url,
                    data: data,
                    headers: {
                        'Content-Type': undefined,
                        token: localStorage.getItem("token") || "",
                    },
                    transformRequest: angular.identity
                }).then(function(response) {
                    //上传成功的操作
                    if (response.data.code == 0) {
                        layer.msg(response.data.msg);
                        deffers.reject(response.data);
                    }
                    deffers.resolve(response.data);
                }, function(response) {
                    //上传失败的操作
                    alertError(response);
                    deffers.reject(response.data);
                });
                return deffers.promise;
            }

            function logindata(user_name, user_password) {
                var url = "user/login";
                var data = {
                    loginName: user_name,
                    plainPassword: user_password
                };
                return httpService(url, data, 'POST');
            }

            // 获取验证码方法
            // function getPhoneCode(phoneNum){
            //      var url = "job/sendMsgCode";
            //      var data = {
            //         mobile: phoneNum,
            //      };
            //      console.log('job/sendMsgCode')
            //     return httpService(url, data, 'get'); 
            // }

            /**
             * [httpService 请求统一的服务]
             * @param  {[type]} url  [请求地址]
             * @param  {[type]} data [参数]
             * @param  {[type]} type [请求方式]
             * @return {[type]}      [description]
             */
            function httpService(url, data, type) {
				
				if ( tokenPassed() &&  !(url == "user/login" || url =='job/sendMsgCode' || url == 'job/mobileLogin') ) {
                    gotoLogin();
                     console.log('aaaa')
                    return $q.reject(0);
                }
				// if(url == 'processConfig/saveProcDef' || url == 'processConfig/updateProcDef'){
					// var contentType = 'application/json'
				// } else {
					// var contentType = 'application/x-www-form-urlencoded'
				// }
                var deffer = $q.defer();
                $http({
                    method: type,
                    url: apiRoot + url,
                    data: type == 'POST' ? data : "",
                    params: type == 'POST' ? "" : data,
                    headers: {
                        'formdata': "1",
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Access-Control-Allow-Origin': '*',
                        'token': localStorage.getItem("token") || "",
                    }
                }).then(function(response) {
                    // 这可以读取header
                    // debugger;
                    alertError(response.data);
                    if (angular.isDefined(response.data.token)) {
                        localStorage.setItem("token", response.data.token);
                    }
                    if (response.data.errorCode == "10000") {
                        $state.go('login');
                    }
                    setToken(response.data);
                    deffer.resolve(response.data);
                }, function(response) {
                    if (response.status == 500) {
                        layer.msg("未能正常连接到后台，请检查网络或服务!");
                    }
                    if (response.status == "-1") {
                        layer.msg("您请求资源：" + url + " 不存在！");
                        // var types = type == "GET" ? "POST" : "GET";
                        // layer.msg("您请求方式有问题,请修改为【"+types+"】请求");
                    }
                    deffer.reject(response.data);
                }).catch(function(e) {
                    layer.msg(e);
                });
                return deffer.promise;
            }
            function jsonPostData(url, data) {
                return jsonHttpService(url, data, 'POST');
            }

            function jsonGetData(url, data) {
                // if (tokenPassed()) {
                //     gotoLogin();
                //     return $q.reject(0);
                // }
                return jsonHttpService(url, data, 'GET');
            }
            
            function jsonHttpService(url, data, type) {
				var res = JSON.stringify(data);
//				if (tokenPassed() &&  url != "user/login") {
				// tokenPassed() &&  url != "user/login" 原来判断
				if ( tokenPassed() &&  !(url == "user/login" || url =='job/sendMsgCode' || url == 'job/mobileLogin') ) {
                    gotoLogin();
                    return $q.reject(0);
               }
                var deffer = $q.defer();
                $http({
                    method: type,
                    url: apiRoot + url,
                    data: type == 'POST' ? res : "",
                    params: type == 'POST' ? "" : res,
                    headers: {
                        'formdata': "1",
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'token': localStorage.getItem("token") || "",
                    }
                }).then(function(response) {
                    // 这可以读取header
                    // debugger;
                    alertError(response.data);
                    if (angular.isDefined(response.data.token)) {
                        localStorage.setItem("token", response.data.token);
                    }
                    if (response.data.errorCode == "10000") {
                        $state.go('login');
                    }
                    setToken(response.data);
                    deffer.resolve(response.data);
                }, function(response) {
                    if (response.status == 500) {
                        layer.msg("未能正常连接到后台，请检查网络或服务!");
                    }
                    if (response.status == "-1") {
                        layer.msg("您请求资源：" + url + " 不存在！");
                        // var types = type == "GET" ? "POST" : "GET";
                        // layer.msg("您请求方式有问题,请修改为【"+types+"】请求");
                    }
                    deffer.reject(response.data);
                }).catch(function(e) {
                    layer.msg(e);
                });
                return deffer.promise;
            }
            
            /**
             * [alertError 拦截各种报错]
             * @return {[type]} [description]
             */
            function alertError(response) {
                if (angular.isDefined(response.code) && response.code == 0) {
                    layer.msg(response.msg);
                }
            }
            /**
             * [setToken 设置token]
             */
            function setToken(data) {
                tokentimespan = parseInt(Date.parse(new Date()) / 1000) + 7100; //token有效900s
                localStorage.setItem("tokentimespan", tokentimespan);
            }

            function loginout() {
                localStorage.setItem("token", '');
                localStorage.setItem("tokentimespan", '0');
                localStorage.setItem("postName", '');
                tokentimespan = localStorage.getItem("tokentimespan");
                token = localStorage.getItem("token");
                window.location.href = "#/login";
            }


            function isSuccess(json) {
                return json && +json.code === 0;
            }

            function isLogout(json) {
                return json && +json.code === -1;
            }

            function gotoError() {
                var deffer = $q.defer();
                window.location.href = "#/error_rem";
                deffer.reject(1);
                return deffer.promise;
            }

            function gotoLogin() {
                var deffer = $q.defer();
                window.location.href = "#/login";
                deffer.reject(1);
                return deffer.promise;
            }

            function tokenPassed(tt) {
                tt = tt || tokentimespan;
                var timestamp = parseInt(Date.parse(new Date()) / 1000);
                return tt < timestamp;
            }
            return {
                loginout: loginout,
                tokenPassed: tokenPassed,
                post: postdata,
                get: getdata,
                jsonGet:jsonGetData,
                jsonPost:jsonPostData,
                login: logindata,
                uploadFile: uploadFile,
                // getPhoneCode:getPhoneCode
            };
        }]);
})(apiRoot);