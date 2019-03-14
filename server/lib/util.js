module.exports = {
    validNick: nickname => /^\w*$/.exec(nickname) !== null,
    findIndex: (arr, id) => {
        var len = arr.length;
        while (len--) if (arr[len].id === id) return len;
        return -1;
    }
};