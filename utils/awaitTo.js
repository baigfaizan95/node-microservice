function to(promise) {
  return promise
    .then(data => [null, data])
    .catch(err => {
      return [err, undefined];
    });
}

module.exports = to;
