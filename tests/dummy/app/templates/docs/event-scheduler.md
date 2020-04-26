# Event Scheduler

Creating a scheduler is straight forward. The only required argument is the options.
Thanks to ember-wormhole and ember multiple yield hash, it helped us to provide a placeholder for all the
different sub-components.

The users can easily yield these placeholders with custom components by calling them as block components or stick with the basic implementation that is provided out of the box by the scheduler. It may sound confusing but once you see the contextual section components you will know sky is the limit.

By default, scheduler will render the calendar for the current date with default view and duration from the options config. However, it's best to pass the selectedDate, selectedView, selectedDuration as arguments and this takes precedence over defaults. Whenever there is any change in any of these properties, the scheduler will trigger the corresponding actions with the newly selected value giving the user the control on what to do when they are changed.

## Arguments

### selectedDate
 - The date for which the calendar has to render the events and resources.
 - The date should be a moment object.

### selectedView
  - The view for which the calendar has to render the events and resources.
  - It should be any one of the keys in the options views hash.

### selectedDuration
  - When an event is dropped on the calendar, the start time is calculated based on the dropped position and the end time is calculated based on this selected duration if the event did not have start and end time previously.
  - The duration should be an object with value and format properties. The format property supports all the formats supported by moment.js.

### isExternalEventsExpanded
 - If the external events are supported, this flag helps to hide/show the external events sidebar.

### options*
 - This is the building block for scheduler and the below options is the default payload which will be merged with the options passed by the user as an argument.

```javascript
const options = {
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
  timePicker: {
    duration: { value: 1, format: 'day' },
    interval: { value: 30, format: 'minute' },
    startAt: { value: 0, format: 'hour' },
    format: 'hh:mm A'
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
      slot: {
        duration: { value: 7, format: 'day' },
        interval: { value: 1, format: 'day' },
        startAt: { value: 0, format: 'hour' },
        startOf: 'week',
      }
    },
    month: {
      label: 'month',
      type: 'month',
      slot: {
        interval: { value: 1, format: 'day' },
        startAt: { value: 0, format: 'hour' },
        startOf: 'month',
      }
    }
  }
};
```

## Actions

### onSchedulerLoad
The onSchedulerLoad hook will return the publicAPI which has all the necessary functions to manage the
events, resources and external-events.


### onEventDrop
The onEventDrop hook will return the updated event data whenever an event is dropped inside the calendar.
That event can be dragged from the external events list or the existing event from the calendar itself.

The event and the corresponding event in the external events list is updated automatically by the scheduler to give the users seamless experience. You can then update your actual model using the updated info and on failure use the revertEvent function in the publicAPI.

## Usage

### Scheduler with events and resources
{{demo-events}}

### Empty scheduler
{{demo-event-scheduler}}
