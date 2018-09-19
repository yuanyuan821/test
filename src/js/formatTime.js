export function formatTime(start, day, num) {
  var date = "";
  if (day || day === 0) {
    var now;
    if (start instanceof Date) {
      now = start;
    }
    now = new Date(start);
    date = new Date(now.getTime() - day * 24 * 3600 * 1000);
  } else {
    if (start) {
      if (start instanceof Date) {
        date = start;
      } else if (typeof start === "number") {
        date = new Date(start);
      } else {
        return start;
      }
    } else {
      date = new Date();
    }

  }
  var formatTime = {};

  formatTime = {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hour: date.getHours(),
    minute: date.getMinutes(),
    second: date.getSeconds(),
    msecond: date.getMilliseconds()
  }
  return formatTime;
}
