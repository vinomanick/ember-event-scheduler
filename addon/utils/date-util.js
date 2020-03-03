import moment from 'moment';

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

const getDuration = (startTime, endTime) => {
  if (startTime && endTime) {
    let timeDifference = moment(endTime).diff(moment(startTime));
    return timeDifference && moment.duration(timeDifference);
  }
};

const getDurationInFormat = (startTime, endTime, format = 'minutes') => {
  let duration = getDuration(startTime, endTime);
  return duration && { value: duration.as(format), format };
};

const addDuration = (date, duration) => {
  if(date && duration) {
    return date.clone().add(duration.value, duration.format);
  }
};

const overrideTime = (date, time, _moment) => {
  let _momentService = _moment || moment;
  if (date && time) {
    let updatedTime = _momentService.utc(time.value, time.format);
    let dateWithNewTime = _momentService.moment(date).add({
      hours: updatedTime.get('hour'),
      minutes: updatedTime.get('minute')
    });
    return dateWithNewTime.toISOString();
  }
};

const getTimeDropdownChoices = (selectedDate, options) => {
  let { duration, interval,  startAt, format } = options;
  let durationObj = moment.duration(duration.value, duration.format);
  let _selectedDate = selectedDate.clone().startOf('day').add(startAt.value, startAt.format);
  return getTimeRange(durationObj, _selectedDate, interval, format);
};

export {
  getDuration,
  getDurationInFormat,
  addDuration,
  overrideTime,
  getTimeRange,
  getTimeDropdownChoices
};