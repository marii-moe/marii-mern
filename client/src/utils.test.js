import { timeDifferenceForDate } from "./utils.js"
/*
function timeDifference(current, previous) {

  const milliSecondsPerMinute = 60 * 1000
  const milliSecondsPerHour = milliSecondsPerMinute * 60
  const milliSecondsPerDay = milliSecondsPerHour * 24
  const milliSecondsPerMonth = milliSecondsPerDay * 30
  const milliSecondsPerYear = milliSecondsPerDay * 365

  const elapsed = current - previous

  if (elapsed < milliSecondsPerMinute / 3) {
    return 'just now'
  }

  if (elapsed < milliSecondsPerMinute) {
    return 'less than 1 min ago'
  }

  else if (elapsed < milliSecondsPerHour) {
    return Math.round(elapsed/milliSecondsPerMinute) + ' min ago'
  }

  else if (elapsed < milliSecondsPerDay ) {
    return Math.round(elapsed/milliSecondsPerHour ) + ' h ago'
  }

  else if (elapsed < milliSecondsPerMonth) {
    return Math.round(elapsed/milliSecondsPerDay) + ' days ago'
  }

  else if (elapsed < milliSecondsPerYear) {
    return Math.round(elapsed/milliSecondsPerMonth) + ' mo ago'
  }

  else {
    return Math.round(elapsed/milliSecondsPerYear ) + ' years ago'
  }
}
*/
it('returns just now', () => {
  let timeString = timeDifferenceForDate(new Date())
  expect(timeString).toEqual(expect.stringContaining('just now'))
});
it('returns less than 1 min ago', () => {
  let twentySecondsAgo = (new Date()).setSeconds((new Date().getSeconds()-20))
  let timeString = timeDifferenceForDate(twentySecondsAgo)
  expect(timeString).toEqual(expect.stringContaining('less than 1 min ago'))
});
it('returns min ago', () => {
  let fiveMinutesAgo = (new Date()).setMinutes((new Date().getMinutes()-5))
  let timeString = timeDifferenceForDate(fiveMinutesAgo)
  expect(timeString).toEqual(expect.stringContaining('min ago'))
});
it('returns h ago', () => {
  let fiveHoursAgo = (new Date()).setHours((new Date().getHours()-5))
  let timeString = timeDifferenceForDate(fiveHoursAgo)
  expect(timeString).toEqual(expect.stringContaining('h ago'))
});
it('returns days ago', () => {
  let fiveDaysAgo = (new Date()).setDate((new Date().getDate()-5))
  let timeString = timeDifferenceForDate(fiveDaysAgo)
  expect(timeString).toEqual(expect.stringContaining('days ago'))
});
it('returns mo ago', () => {
  let fiveMonthsAgo = (new Date()).setMonth((new Date().getMonth()-5))
  let timeString = timeDifferenceForDate(fiveMonthsAgo)
  expect(timeString).toEqual(expect.stringContaining('mo ago'))
});
it('returns years ago', () => {
  let fiveYearsAgo = (new Date()).setFullYear((new Date().getFullYear()-5))
  let timeString = timeDifferenceForDate(fiveYearsAgo)
  expect(timeString).toEqual(expect.stringContaining('years ago'))
});
