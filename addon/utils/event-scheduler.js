import moment from 'moment';
import { getTimeRange } from './date-util';
import CalendarEvent from '../_private/classes/calendar-event';

const getCustomResourceId = (id) => {
  return `resource_${id}`;
};

const getCustomEventId = (id) => {
  return `event_${id}`;
};

const buildCalendarEvent = (event, calendarInst, moment) => {
  let { id, startTime, endTime, resourceId, title } = event;
  let eventObj = CalendarEvent.create({
    id,
    title,
    startTime,
    endTime,
    resourceId,
    calendarInst,
    moment
  });
  return eventObj;
};

const getSlots = (selectedDate, options) => {
  let { duration, interval, startAt, startOf } = options;
  let durationObj = moment.duration(duration.value, duration.format);
  let offsetDate = selectedDate.clone().startOf(startOf).add(startAt.value, startAt.format);
  return getTimeRange(durationObj, offsetDate, interval);
};

const getCalendarPeriod = (startTime, endTime, dayFormat, _moment) => {
  let _momentService = _moment || moment;
  if (startTime && endTime) {
    let _startTime = _momentService.moment(startTime);
    let _endTime = _momentService.moment(endTime);
    if (_startTime.isSame(_endTime, 'day')) {
      _startTime.format(dayFormat);
    } else if (_startTime.isSame(_endTime, 'month')) {
      _startTime.format('MMMM YYYY');
    } else if (_startTime.isSame(_endTime, 'year')) {
      return `${_startTime.format('MMM')} - ${_endTime.format('MMM YYYY')}`;
    }
    return `${_startTime.format('MMM YYYY')} - ${_endTime.format('MMM YYYY')}`;
  }
};

const getEventPeriod = (startTime, endTime, dateTimeFormat, timeFormat, _moment) => {
  let _momentService = _moment || moment;
  if (startTime && endTime) {
    let _startTime = _momentService.moment(startTime);
    let _endTime = _momentService.moment(endTime);
    return _startTime.isSame(_endTime, 'day')
      ? `${_startTime.format(dateTimeFormat)} -  ${_endTime.format(timeFormat)}`
      : `${_startTime.format(dateTimeFormat)} -  ${_endTime.format(dateTimeFormat)}`
  }
};

const getEventCompactPeriod = (startTime, endTime, _moment) => {
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

/**
 *
 * @param {Number} durationInMins
 * Duration value should be in minutes
 * @param {Object} slotConfig
 * should contain slot width in number and slot interval as object like below
 * { width: 50, interval: { value: 30, format: 'minute' } }
 */
const getTimerPos = (durationInMins, slotConfig) => {
  let { width, interval } = slotConfig;
  let intervalInMins = moment.duration(interval.value, interval.format).asMinutes();
  return (durationInMins * width) / intervalInMins;
};

export { getSlots, buildCalendarEvent, getTimerPos,
  getCalendarPeriod, getEventPeriod, getEventCompactPeriod,
  getCustomResourceId, getCustomEventId };