/**
 * by rufeng
 * data 2017-10-24
 */
"use strict";
angular.module("lsmSpliceStringModule", []).
factory("lsmSpliceString", [function() {
    return {
        /* 拼接字符串*/
        spliceString: function(array, attribute, symbol, enVCalue, type) {
            var myString = "";
            angular.forEach(array, function(data, index, arrayC) {
                if (data[enVCalue] === type) {
                    myString += data[attribute] + symbol;
                }
            });
            myString = myString.substring(0, myString.length - symbol.length);
            return myString;
        },
        getArrayDate: function(array, key, newKey) {
            var temp = [],
                keys = key,
                newKeys = newKey;
            angular.forEach(array, function(data, index, arrayC) {
                data[newKeys] = data[keys]+'';
                temp.push(data);
            });
            return temp;
        },
        getArrayString: function(array, typename, symbol) {
            var arr = [];
            angular.forEach(array, function(n, i) {
                n[typename] && arr.push(n[typename]);
            });
            return arr.join(symbol);
        },
        filter: function(array, attribute, enVCalue, type) {
            var temp = [];
            angular.forEach(array, function(data, index, arrayC) {
                if (data[enVCalue] === type) {
                    temp.push(data[attribute]);
                }
            });
            return temp;
        },
        filterArr: function(array, attribute, enVCalue, type) {
            var temp = [];
            angular.forEach(array, function(data, index, arrayC) {
                if (data[enVCalue] === type) {
                    temp.push(data);
                }
            });
            return temp;
        },
        getValuesBykey: function(objArr, key) {
            var temp = [];
            angular.forEach(objArr, function(item, idx) {
                temp.push(item[key]);
            });
            return temp;
        },
        where: function(arr, properties) {
            var temp = [];
            angular.forEach(arr, function(item, idx) {
                if (trsspliceTool.predicate(item, properties)) temp.push(item);
            });
            return temp;
        },
        predicate: function(obj, properties) {
            var flag = true;
            angular.forEach(properties, function(value, key) {
                if (value !== obj[key] || obj[key] === undefined) {
                    flag = false;
                }
            });
            return flag;
        }

    };
}]);