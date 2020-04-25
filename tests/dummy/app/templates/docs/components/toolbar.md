# Toolbar

The toolbar component basically helps us to perform all the navigations and manage calendar defaults like the calendar view and the drag and drop default duration.

This is a block component and contains three sections which are again components that can be called as inline component or block component.

## Toolbar-Left
- The external events sidebar toggle icon will be visible only when the below properties are true.

```javascript
const options = {
  hasExternalEvents: true,
  toolbar: {
    showExternalEventsToggle: true
  }
};
```
- The today button, previous and next icons triggers the onDateChange action with the selected date.


## Toolbar-Center
- Displays the selected date and on clicking it opens a calendar picker to navigate to any given date.
- Date format for **day/timeline** view
#### 1. The date is formatted using the options.toolbar.dateFormat format

```javascript
const options = {
  toolbar: {
    dateFormat: 'DD MMMM YYYY'
  }
};
```
- Date format for **week** and **month** view
#### 1. Same month - 'MMMM YYYY'
#### 2. Different month - 'MMM - MMM YYYY'
#### 3. Different year - 'MMM YYYY - MMM YYYY'

## Toolbar-Right

### Duration
- Duration dropdown helps to change the default duration for dropped events. When an event is dropped on the calendar, the start time is calculated based on the dropped position and the end time is calculated based on this default duration if the event did not have start and end time previously.
- The duration hash supports all the formats supported by moment.js. The dropdown values and default values can be modified by changing the below properties.

```javascript
const options = {
  duration: {
    default: { value: 60, format: 'minute' },
    options: [
      { value: 30, format: 'minute' },
      { value: 60, format: 'minute' },
      { value: 90, format: 'minute' },
      { value: 120, format: 'minute' }
    ]
  }
};
```

### View
- The view dropdown lists all the views provided in the calendar options hash and triggers the onViewChange action with the selected view.

```javascript
const options = {
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

### onDateChange
The onDateChange hook will return the newly selected date

### onViewChange
The onDateChange hook will return the newly selected view

### onDurationChange
The onDurationChange hook will return the newly selected duration as value, format object.

### onExternalEventToggle
The onDurationChange hook is fired when the toggle button is clicked.

## Usage

{{demo-toolbar}}
