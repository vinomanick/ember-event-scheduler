import moment from 'moment';
import { VIEWS } from '../constants/event-scheduler';
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

const getCompactEventTime = (eventStartTime, eventEndTime, momentService) => {
  let _momentService = momentService || moment;
  if (eventStartTime && eventEndTime) {
    let startTime = _momentService.moment(eventStartTime);
    let endTime = _momentService.moment(eventEndTime);
    let [startHr, startMn, startMD] = startTime.format('h mm a').split(' ');
    let [endHr, endMn, endMD] = endTime.format('h mm a').split(' ');
    let startHM = parseInt(startMn) ? `${startHr}:${startMn}` : startHr;
    let endHM = parseInt(endMn) ? `${endHr}:${endMn}` : endHr;
    if (startTime.isSame(endTime, 'day')) {
      return startMD === endMD ? `${startHM} - ${endHM}${endMD}` : `${startHM}${startMD} - ${endHM}${endMD}`;
    } else {
      let startDay = `${startTime.format('D MMM')} ${startHM}${startMD}`;
      let endDay = `${endTime.format('D MMM')} ${endHM}${endMD}`;
      return `${startDay} - ${endDay}`;
    }
  }
};

const getCurrentPeriod = (viewType, selectedDate, dayDateFormat = 'DD MMMM YYYY') => {
  if (viewType === VIEWS.DAY) {
    return selectedDate.format(dayDateFormat);
  } else {
    let startDay = selectedDate.clone().startOf('week');
    let endDay = selectedDate.clone().endOf('week');
    if (!startDay.isSame(endDay, 'year')) {
      return `${startDay.format('MMM YYYY')} - ${endDay.format('MMM YYYY')}`;
    } else if (!startDay.isSame(endDay, 'month')) {
      return `${startDay.format('MMM')} - ${endDay.format('MMM YYYY')}`;
    }
    return startDay.format('MMMM YYYY');
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

export { getSlots, buildCalendarEvent,
   getCompactEventTime, getCurrentPeriod, getTimerPos,
  getCustomResourceId, getCustomEventId };