module.exports = {
    validNick: nickname => /^\w*$/.exec(nickname) !== null,
    findIndex: (arr, id) => {
        var len = arr.length;
        while (len--)
            if (arr[len].id === id) return len;
        return -1;
    },
    is: (value, array) => {
        var result = false;
        array.forEach(element => result = value === element ? true : result);
        return result;
    },
    sameKeys: (keys1, keys2) => {
        if (keys1.left !== keys2.left ||
            keys1.right !== keys2.right ||
            keys1.up !== keys2.up ||
            keys1.down !== keys2.down ||
            keys1.a !== keys2.a ||
            keys1.b !== keys2.b
        ) return false;
        else return true;
    }
};