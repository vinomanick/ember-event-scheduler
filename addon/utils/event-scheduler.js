import moment from 'moment';
import { getTimeRange, getDurationAs } from './date-util';

const getEventMandates = (event) => {
  let { startTime, endTime, resourceId, isCalendarEvent } = event;
  return { startTime, endTime, resourceId, isCalendarEvent }
};

const getSlots = (selectedDate, options) => {
  let { duration, interval, startAt, startOf } = options;
  let durationObj = moment.duration(duration.value, duration.format);
  let offsetDate = selectedDate.clone().startOf(startOf).add(startAt.value, startAt.format);
  return getTimeRange(durationObj, offsetDate, interval);
};

const getStartEndDate = (selectedDate, options) => {
  let { duration, startAt, startOf } = options;
  let startTime = selectedDate.clone().startOf(startOf).add(startAt.value, startAt.format);
  let endTime = startTime.clone().add(duration.value, duration.format).subtract(1, 'second');
  return { startTime, endTime };
};

const getCalendarPeriod = (selectedDate, dayFormat, options) => {
  let {startTime, endTime } = getStartEndDate(selectedDate, options);
  if (startTime && endTime) {
    if (startTime.isSame(endTime, 'day')) {
      return startTime.format(dayFormat);
    } else if (startTime.isSame(endTime, 'month')) {
      return startTime.format('MMMM YYYY');
    } else if (startTime.isSame(endTime, 'year')) {
      return `${startTime.format('MMM')} - ${endTime.format('MMM YYYY')}`;
    }
    return `${startTime.format('MMM YYYY')} - ${endTime.format('MMM YYYY')}`;
  }
};

const getExternalEventPeriod = (startTime, endTime, dateTimeFormat, timeFormat, _moment) => {
  let _momentService = _moment || moment;
  if (startTime && endTime) {
    let _startTime = _momentService.moment(startTime);
    let _endTime = _momentService.moment(endTime);
    return _startTime.isSame(_endTime, 'day')
      ? `${_startTime.format(dateTimeFormat)} -  ${_endTime.format(timeFormat)}`
      : `${_startTime.format(dateTimeFormat)} -  ${_endTime.format(dateTimeFormat)}`
  }
};

const getEventPeriodDayView = (startTime, endTime, _moment) => {
  let _momentService = _moment || moment;
  if (startTime && endTime) {
    let _startTime = _momentService.moment(startTime);
    let _endTime = _momentService.moment(endTime);
    let timeDifference = _endTime.diff(_startTime);
    if (timeDifference > 0) {
      let timeDuration = moment.duration(timeDifference);
      let dayDivident = _startTime.isLeapYear() ?  366 : 365;
      let days = getDurationAs(timeDuration, 'day', dayDivident, 'day');
      let hours = getDurationAs(timeDuration, 'hour', 24, 'hr');
      let minutes = getDurationAs(timeDuration, 'minute', 60, 'min');
      return `${days} ${hours} ${minutes}`.trim();
    }
  }
};

const getEventPeriodCompact = (startTime, endTime, _moment) => {
  let _momentService = _moment || moment;
  if (startTime && endTime) {
    let _startTime = _momentService.moment(startTime);
    let _endTime = _momentService.moment(endTime);
    let [startHr, startMn, startMD] = _startTime.format('h mm a').split(' ');
    let [endHr, endMn, endMD] = _endTime.format('h mm a').split(' ');
    let startHM = parseInt(startMn) ? `${startHr}:${startMn}` : startHr;
    let endHM = parseInt(endMn) ? `${endHr}:${endMn}` : endHr;
    if (_startTime.isSame(_endTime, 'day')) {
      return startMD === endMD ? `${startHM} - ${endHM}${endMD}` : `${startHM}${startMD} - ${endHM}${endMD}`;
    } else {
      let startDay = `${_startTime.format('D MMM')} ${startHM}${startMD}`;
      let endDay = `${_endTime.format('D MMM')} ${endHM}${endMD}`;
      return `${startDay} - ${endDay}`;
    }
  }
};

// const getTimerPos = (durationInMins, slotConfig) => {
//   let { width, interval } = slotConfig;
//   let intervalInMins = moment.duration(interval.value, interval.format).asMinutes();
//   return (durationInMins * width) / intervalInMins;
// };

export { getSlots,
  getEventMandates,
  getCalendarPeriod, getExternalEventPeriod, getEventPeriodDayView, getEventPeriodCompact };
