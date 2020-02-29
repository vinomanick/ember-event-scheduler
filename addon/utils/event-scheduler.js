import moment from 'moment';
import { VIEWS } from '../constants/event-scheduler';

const slotDefaultChoices = {
  duration: { value: 1, format: 'day' },
  interval: { value: 30, format: 'minute' },
  startAt: { value: 0, format: 'hour' },
  startOf: 'day'
};

const getTimeRange = (durationObj, selectedDate, interval, timeFormat) => {
  let timeRange = [];
  let { value, format } = interval;
  let duration = durationObj.as(format);
  for (let i = 0; i < duration; i += value) {
    selectedDate.add(i === 0 ? 0 : value, format);
    timeRange.push(timeFormat ? selectedDate.format(timeFormat) : selectedDate.clone());
  }
  return timeRange;
};

const getTimeDropdownChoices = (selectedDate, options) => {
  let { duration, interval,  startAt, format } = options;
  let durationObj = moment.duration(duration.value, duration.format);
  let _selectedDate = selectedDate.clone().startOf('day').add(startAt.value, startAt.format);
  return getTimeRange(durationObj, _selectedDate, interval, format);
};

const getDuration = (startTime, endTime) => {
  if (startTime && endTime) {
    let timeDifference = moment(endTime).diff(moment(startTime));
    return timeDifference && moment.duration(timeDifference);
  }
};

const getSlots = (selectedDate, options = slotDefaultChoices) => {
  let { duration, interval, startAt, startOf } = options;
  let durationObj = moment.duration(duration.value, duration.format);
  let offsetDate = selectedDate.clone().startOf(startOf).add(startAt.value, startAt.format);
  return getTimeRange(durationObj, offsetDate, interval);
};

const getEventDuration = (startTime, endTime, format = 'minutes') => {
  let duration = getDuration(startTime, endTime);
  return duration && { value: duration.as(format), format };
};

const overrideTime = (selectedDate, timeConfig, momentService) => {
  let _momentService = momentService || moment;
  if (selectedDate && timeConfig) {
    let updatedTime = _momentService.utc(timeConfig.value, timeConfig.format);
    let dateWithNewTime = _momentService.moment(selectedDate).add({
      hours: updatedTime.get('hour'),
      minutes: updatedTime.get('minute')
    });
    return dateWithNewTime.toISOString();
  }
};

const buildEventTime = (viewType, selectedDate, columnStart, offset, duration, slotInterval) => {
  let _selectedDate = selectedDate.clone().startOf(viewType);
  let startTime = _selectedDate.add(columnStart * slotInterval.value, slotInterval.format);
  if (offset) {
    startTime.add(offset.value, offset.format);
  }
  let endTime = startTime.clone().add(duration.value, duration.format);
  return { startTime: startTime.toISOString(), endTime: endTime.toISOString() };
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

const getColumnFromPos = (position, slotWidth, slotsLength) => {
  let columnStart = position % slotWidth < (4 * slotWidth) / 5
    ? Math.floor(position / slotWidth)
    : Math.ceil(position / slotWidth);
  return columnStart === slotsLength ? columnStart - 1 : columnStart;
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

export { getSlots, getTimeDropdownChoices, getEventDuration, overrideTime,
  buildEventTime, getCompactEventTime, getColumnFromPos, getCurrentPeriod, getTimerPos };