const config = {
  defaultView: 'day',
  showCurrentTime: true,
  currentTimePosInterval: 5 * 60 * 1000,
  queryParamsDateFormat: 'YYYY-MM-DD',
  externalEvents: {
    draggable: true,
    perPage: 30,
    defaultFilter: 'unresolved_service_tasks', // ToDo - Change to unassigned_service_tasks once it is made as a default filter
    emptyMessage: 'field_service_management.schedule_dashboard.external_events.empty_message'
  },
  resources: {
    perPage: 20,
    emptyMessage: 'field_service_management.schedule_dashboard.empty_message',
  },
  events: {
    perPage: 20,
    draggable: true
  },
  toolbar: {
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
