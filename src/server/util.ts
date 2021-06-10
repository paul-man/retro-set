let util = {
  newID: () => {
    // https://gist.github.com/gordonbrander/2230317
    return Array(16)
          .fill(0)
          .map(() => String.fromCharCode(Math.floor(Math.random() * 26) + 97))
          .join('') + 
          Date.now().toString(24);
  }
};

module.exports = util;
