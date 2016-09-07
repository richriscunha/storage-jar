/**
 * StorageJar is a minimal API for interfacing with Local Storage.  In the event that
 * Local Store is not available, StorageJar will fallback to using Cookies.
 * @class
 **/
export default class StorageJar {
	/**
	 * This function determines if a key exists in either Cookies or Local Storage.
	 * @param {string} key the key of the item you are querying.
	 * @returns {boolean}.
	 * @function
	 * @name contains
	 * @static
	 * @public
	 *
	 * @example
	 * StorageJar.contains("hello");
	 **/
	static contains(key) {
		const item = this.read(key);
		if (item !== null)
			return true;

		return false;
	}
	/**
	 * This function converts the given number of days into milliseconds.
	 * @param {number} days the number of days to convert into milliseconds.
	 * @returns {number} the representation of days in milliseconds.
	 * @function
	 * @name convertDaysToMillis
	 * @static
	 * @private
	 **/
	static convertDaysToMillis(days) {
		return days * 24 * 60 * 60 * 1000;
	}
	/**
	 * This function will delete an item for either Cookies or Local Storage if it exists.
	 * @param {string} key the key of the item you are trying to delete.
	 * @returns {boolean}.
	 * @function
	 * @name delete
	 * @static
	 * @public
	 *
	 * @example
	 * StorageJar.delete("hello");
	 **/
	static delete(key) {
		if (! this.contains(key))
			return false;

		this.hasLocalStorage() ? window.localStorage.removeItem(key) : this.write(key, '', -1);
		return true;
	}
	/**
	 * This function is responsible for generating the value object of a Local Storage item.
	 * @param {value} value the value of the item you are trying to insert.
	 * @param {lifetime} lifetime the lifetime in days you wish to store the item for.
	 * @returns {object} the object to be stored as the item's value.
	 * @function
	 * @name generateStorageValue
	 * @static
	 * @private
	 **/
	static generateStorageValue(value, lifetime) {
		return {
			value,
			"timestamp": this.generateLifetimeTimestamp(lifetime)
		}
	}
	/**
	 * This function is responsible for generating the expiration timestamp of a stored item.
	 * @param {number} days the number of days you wish to store an item for.
	 * @returns {number} the expiration date in milliseconds.
	 * @function
	 * @name generateLifetimeTimestamp
	 * @static
	 * @private
	 **/
	static generateLifetimeTimestamp(days) {
		const currentTimestamp = new Date();
		return currentTimestamp.getTime() + this.convertDaysToMillis(days);
	}
	/**
	 * This function is responsible for generating the expiration timestamp of a stored item.
	 * @returns {localStorage|NULL} localStorage or null if localStorage is not available.
	 * @function
	 * @name hasLocalStorage
	 * @static
	 * @private
	 **/
	static hasLocalStorage() {
		return window.localStorage;
	}
	/**
	 * This function is responsible for determining if an item for Local Storage has expired.
	 * @param {number} timestamp the expiration timestamp of item in question.
	 * @returns {boolean}.
	 * @function
	 * @name isTimestampValid
	 * @static
	 * @private
	 **/
	static isTimestampValid(timestamp) {
		const currentTimestamp = new Date();
		return currentTimestamp.getTime() <= timestamp;
	}
	/**
	 * This function is responsible for fetching an item from either Cookies or Local Storage.
	 * @param {string} key the key of the item you are trying to fetch.
	 * @returns {object|NULL} the value of the item will be returned if found. if not, null will be returned.
	 * @function
	 * @name read
	 * @static
	 * @public
	 *
	 * @example
	 * StorageJar.read("hello");
	 **/
	static read(key) {
		if (this.hasLocalStorage()) {
			let item = JSON.parse(window.localStorage.getItem(key));
			if (item !== null && this.isTimestampValid(item.timestamp))
				return item;
		} else {
		    let name = key + "=";
		    let cookies = document.cookie.split(';');
		    for(var i = 0; i < cookies.length; i++) {
		        let cookie = cookies[i];
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
	/**
	 * This function is responsible for writing an item to either Cookies or Local Storage.
	 * @param {string} key the key of the item you are trying to store.
	 * @param {string} value the value of the item you are trying to store.
 	 * @param {number} [lifetime=7] the length of time in days, you wish to store the item.
	 * @function
	 * @name write
	 * @static
	 * @public
	 *
	 * @example
	 * StorageJar.write("hello", "world", 5);
	 **/
	static write(key, value, lifetime = 7) {
		if ( this.hasLocalStorage() ) {
			const _value = this.generateStorageValue(value, lifetime);
			window.localStorage.setItem(key, JSON.stringify(_value));
		} else {
			let date = new Date();
			date.setTime(date.getTime() + (lifetime * 24 * 60 * 60 * 1000));
        	const expires = '; expires=' + date.toGMTString();
	        document.cookie = key + ' = ' + value + expires + '; path=/';
		}
	}
}
