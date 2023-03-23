function formatTime(msec) {
  const date = new Date(msec);
  const h = date.getHours();
  const hStr = h < 10 ? `0${h}` : h;
  const m = date.getMinutes();
  const mStr = m < 10 ? `0${m}` : m;
  return `${hStr}:${mStr}`;
}

export {
  formatTime
}