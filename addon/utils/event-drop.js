import { VIEWS } from '../constants/event-scheduler';
import { getDurationInFormat, addDuration, overrideTime } from './date-util';

const _getSlotInfo = (resourceElement) => {
  if (resourceElement) {
    let elementStyle = window.getComputedStyle(resourceElement);
    let slotsArray = elementStyle.gridTemplateColumns.split(' ');
    return {
      slotWidth: parseFloat(slotsArray[0]),
      slotsLength: slotsArray.length
    };
  }
};

const _getEventPosition = (element, clientX, offset) => {
  return clientX - offset - element.getBoundingClientRect().left;
};

const getResourceElement = (target) => {
  return target.closest('[data-name="resource"]');
};

const getResourceId = (resourceElement) => {
  if(resourceElement) {
    return resourceElement.getAttribute('data-resource-id');
  }
};

const getColumnStart = (resourceElement, clientX, offset) => {
  let { slotWidth, slotsLength } = _getSlotInfo(resourceElement);
  let eventPosition = _getEventPosition(resourceElement, clientX, offset);

  let columnStart = eventPosition % slotWidth < (4 * slotWidth) / 5
    ? Math.floor(eventPosition / slotWidth)
    : Math.ceil(eventPosition / slotWidth);
  return columnStart === slotsLength ? columnStart - 1 : columnStart;
};


const getStartTimeOffset = (viewType, prevStartTime, offset, _moment) => {
  if(viewType === VIEWS.DAY) {
    return;
  }

  // Returns the duration of dropped date with tickets previous start time for week/month view
  if(prevStartTime) {
    let prevStartOfDay = _moment.moment(prevStartTime).startOf('day').toISOString();
    return getDurationInFormat(prevStartOfDay, prevStartTime);
  }

  // Returns the duration of dropped date with chosen time from the dropdown for week/month view
  let startOfDay = _moment.moment().startOf('day').toISOString();
  let dateWithNewTime = overrideTime(startOfDay, offset, _moment);
  return getDurationInFormat(startOfDay, dateWithNewTime);
}

const buildEventStartTime = (viewType, selectedDate, columnStart, slotInterval, offset) => {
  let startOfViewType = selectedDate.clone().startOf(viewType);
  let startTime = startOfViewType.add(columnStart * slotInterval.value, slotInterval.format);
  if (offset) {
    startTime = addDuration(startTime, offset);
  }
  return startTime;
};

const buildEventTime = (viewType, selectedDate, columnStart, slotInterval, startTimeOffset, eventDuration) => {
  let startTime = buildEventStartTime(viewType, selectedDate, columnStart, slotInterval, startTimeOffset);
  let endTime = addDuration(startTime, eventDuration);

  return { startTime: startTime.toISOString(), endTime: endTime.toISOString() };
};

export { getResourceElement, getResourceId, getColumnStart,
  getStartTimeOffset, buildEventTime };