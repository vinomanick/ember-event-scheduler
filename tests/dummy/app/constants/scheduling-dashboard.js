const config = {
  defaultView: 'day',
  showCurrentTime: true,
  hasExternalEvents: true,
  currentTimePosInterval: 5 * 60 * 1000,
  queryParamsDateFormat: 'YYYY-MM-DD',
  externalEvents: {
    draggable: true,
    perPage: 30,
  },
  resources: {
    perPage: 20,
  },
  events: {
    perPage: 20,
    draggable: true
  },
  toolbar: {
    showExternalEventsToggle: true,
    duration: {
      default: { value: 60, format: 'minute' },
      options: [
        { value: 30, format: 'minute' },
        { value: 60, format: 'minute' },
        { value: 90, format: 'minute' },
        { value: 120, format: 'minute' }
      ]
    },
    dateFormat: 'DD MMMM YYYY'
  },
  views: {
    day: {
      label: 'day',
      type: 'day',
      slot: {
        width: 50,
        duration: { value: 1, format: 'day' },
        interval: { value: 30, format: 'minute' },
        startAt: { value: 0, format: 'hour' },
        startOf: 'day',
        format: 'hh:mm A'
      }
    },
    week: {
      label: 'week',
      type: 'week',
      timePicker: {
        duration: { value: 1, format: 'day' },
        interval: { value: 30, format: 'minute' },
        startAt: { value: 0, format: 'hour' },
        format: 'hh:mm A'
      },
      slot: {
        duration: { value: 7, format: 'day' },
        interval: { value: 1, format: 'day' },
        startAt: { value: 0, format: 'hour' },
        startOf: 'week',
      }
    }
  }
};


export { config };
