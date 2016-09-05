(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.StorageJar = factory());
}(this, (function () { 'use strict';

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var StorageJar = function () {
	function StorageJar() {
		classCallCheck(this, StorageJar);
	}

	createClass(StorageJar, null, [{
		key: "contains",
		value: function contains(key) {
			var item = this.read(key);
			if (item !== null) return true;

			return false;
		}
	}, {
		key: "convertDaysToMillis",
		value: function convertDaysToMillis(days) {
			return days * 24 * 60 * 60 * 1000;
		}
	}, {
		key: "delete",
		value: function _delete(key) {
			if (!this.contains(key)) return false;

			this.hasLocalStorage() ? window.localStorage.removeItem(key) : this.write(key, '', -1);
			return true;
		}
	}, {
		key: "generateStorageValue",
		value: function generateStorageValue(value, lifetime) {
			return {
				value: value,
				"timestamp": this.generateLifetimeTimestamp(lifetime)
			};
		}
	}, {
		key: "generateLifetimeTimestamp",
		value: function generateLifetimeTimestamp(days) {
			var currentTimestamp = new Date();
			return currentTimestamp.getTime() + this.convertDaysToMillis(days);
		}
	}, {
		key: "hasLocalStorage",
		value: function hasLocalStorage() {
			return window.localStorage;
		}
	}, {
		key: "isTimestampValid",
		value: function isTimestampValid(timestamp) {
			var currentTimestamp = new Date();
			return timestamp < currentTimestamp.getTime();
		}
	}, {
		key: "read",
		value: function read(key) {
			if (this.hasLocalStorage() && this.contains(key)) {
				var item = JSON.parse(window.localStorage.getItem(key));
				if (this.isTimestampValid(item.timestamp)) return item;
			} else {
				var name = key + "=";
				var cookies = document.cookie.split(';');
				for (var i = 0; i < cookies.length; i++) {
					var cookie = cookies[i];
					while (cookie.charAt(0) == ' ') {
						cookie = cookie.substring(1);
					}
					if (cookie.indexOf(name) == 0) {
						return cookie.substring(name.length, cookie.length);
					}
				}
			}

			return null;
		}
	}, {
		key: "write",
		value: function write(key, value) {
			var lifetime = arguments.length <= 2 || arguments[2] === undefined ? 7 : arguments[2];

			if (this.hasLocalStorage()) {
				var _value = this.generateStorageValue(value, lifetime);
				window.localStorage.setItem(key, JSON.stringify(_value));
			} else {
				var date = new Date();
				date.setTime(date.getTime() + lifetime * 24 * 60 * 60 * 1000);
				var expires = '; expires=' + date.toGMTString();
				document.cookie = key + ' = ' + value + expires + '; path=/';
			}
		}
	}]);
	return StorageJar;
}();

return StorageJar;

})));