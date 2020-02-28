const config = {
  defaultView: 'day',
  showCurrentTime: true,
  currentTimePosInterval: 5 * 60 * 1000,
  duration: {
    default: { value: 60, format: 'minute' },
    options: [
      { value: 30, format: 'minute' },
      { value: 60, format: 'minute' },
      { value: 90, format: 'minute' },
      { value: 120, format: 'minute' }
    ]
  },
  queryParamsDateFormat: 'YYYY-MM-DD',
  emptyMessage: 'field_service_management.schedule_dashboard.empty_message',
  externalEvents: {
    draggable: true,
    perPage: 30,
    defaultFilter: 'unresolved_service_tasks', // ToDo - Change to unassigned_service_tasks once it is made as a default filter
    emptyMessage: 'field_service_management.schedule_dashboard.external_events.empty_message'
  },
  resources: {
    perPage: 20
  },
  events: {
    perPage: 20,
    draggable: true
  },
  views: {
    day: {
      label: 'fd.day',
      type: 'day',
      toolbar: { dateFormat: 'DD MMMM YYYY' },
      slot: {
        width: 50,
        duration: { value: 1, format: 'day' },
        interval: { value: 30, format: 'minute' },
        startAt: { value: 0, format: 'hour' },
        format: 'hh:mm A'
      }
    },
    week: {
      label: 'fd.week',
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
        startAt: { value: 0, format: 'hour' }
      }
    }
  }
};


export { config };
