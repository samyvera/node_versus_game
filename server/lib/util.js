module.exports = {
    validNick: nickname => /^\w*$/.exec(nickname) !== null,
    findIndex: (arr, id) => {
        var len = arr.length;
        while (len--) if (arr[len].id === id) return len;
        return -1;
    },
    sameKeys: (keys1, keys2) => {
        for (let i = 0; i < keys1.length; i++) {
            if (keys1[i] !== keys2[i]) return false;
        }
        return true;
    }
};