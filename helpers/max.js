function calcMax(...arrays) {
    comb = arrays.reduce((acc, curr) => {
        return acc * curr.length
    }, 1)

    return comb;
}


module.exports = { calcMax }