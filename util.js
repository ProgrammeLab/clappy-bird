function throttle(func, leading, interval) {
  let timer = null;
  return (...params) => {
    if (leading && !timer) {
      func(...params);
    }
    timer = setTimeout(() => {
      timer = null;
      if (!leading) {
        func(...params);
      }
    }, interval);
  };
}
