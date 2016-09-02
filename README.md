# StorageJar

StorageJar is a minimal API for interfacing with Local Storage.  In the event that
Local Store is not available, StorageJar will fallback to using Cookies.

----------

## Installation
  
The library may be installed from NPM using the following command:

	npm install --save storage-jar
    
Or, if you would rather -- it may included directly inline within your HTML document.

    <script src="./dist/storage-jar.min.js></script>

----------

## API Methods

### write(key, value, lifetime)

This function is responsible for writing an item to either Cookies or Local Storage.

**Parameters**

-   `key` **string** the key of the item you are trying to store.
-   `value` **string** the value of the item you are trying to store.
-   `lifetime` **[number]** the length of time in days, you wish to store the item. (optional, default `7`)

**Examples**

```javascript
StorageJar.write("hello", "world", 5);
```

----------

### read(key)

This function is responsible for fetching an item from either Cookies or Local Storage.

**Parameters**

-   `key` **string** the key of the item you are trying to fetch.

**Examples**

```javascript
const value = StorageJar.read("hello");
console.log(value); // "world"
console.log(value); // null
```

Returns **object or NULL** the value of the item will be returned if found. if not, null will be returned.

----------

### contains(key)

This function determines if a key exists in either Cookies or Local Storage.

**Parameters**

-   `key` **string** the key of the item you are querying.

**Examples**

```javascript
StorageJar.contains("hello"); // true or false
```

Returns **boolean** .

----------

### delete(key)

This function will delete an item for either Cookies or Local Storage if it exists.

**Parameters**

-   `key` **string** the key of the item you are trying to delete.

**Examples**

```javascript
StorageJar.delete("hello"); // true or false
```

Returns **boolean** .