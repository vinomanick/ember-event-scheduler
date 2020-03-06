import EmberObject, { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import { assert } from '@ember/debug';
import { isPresent } from '@ember/utils';
import { run } from '@ember/runloop';
import { VIEWS } from '../../constants/event-scheduler';
import { getSlots, getCustomEventId, buildCalendarEvent } from '../../utils/event-scheduler';
import { A } from '@ember/array';
// import { inject as service } from '@ember/service';

export default EmberObject.extend({
  // moment: service(),
  // calendarEvents: undefined,
  // selectedDate: undefined,
  // selectedView: VIEWS.DAY,

  isEventsDraggable: reads('config.events.draggable'),
  viewType: reads('viewConfig.type'),
  slotConfig: reads('viewConfig.slot'),
  slotInterval: reads('slotConfig.interval'),
  slotFormat: reads('slotConfig.format'),
  slotsLength: reads('slots.length'),
  viewConfig: computed('selectedView', function() {
    let _selectedView = this.get('selectedView');
    let _views = this.get('config.views');
    return _views[_selectedView];
  }),

  slots: computed('viewType', 'selectedDate', function() {
    let _viewType = this.get('viewType');
    return _viewType === VIEWS.DAY
      ? this.get('daySlots')
      : getSlots(this.get('selectedDate'), this.get('slotConfig'));
  }),
  daySlots: computed(function() {
    return getSlots(this.get('moment').moment(), this.get('slotConfig'));
  }),

  init() {
    let { config, selectedDate, selectedView, moment }
      = this.getProperties(['config', 'selectedDate', 'selectedView', 'moment']);

    assert('config is required', isPresent(config));
    assert('selected date is required', isPresent(selectedDate));
    assert('selected view is required', isPresent(selectedView));
    assert('moment  is required', isPresent(moment));

    this.set('events', EmberObject.create());
    this.set('resources', A());
  },

  setDuration(duration) {
    this.set('selectedDuration', duration);
  },

  // Resources manipulation
  addResources(resources = []) {
    let calendarResources = this.get('resources');
    resources.forEach(({ id, name }) => {
      calendarResources.push({ id, name });
    });
  },

  deleteAllResources() {
    this.get('resources').clear();
  },

  // Events manipulation
  addEvents(events = []) {
    let { events: _events, moment }
      = this.getProperties(['events', 'moment']);
    events.forEach((event) => {
      let eventObj = buildCalendarEvent(event, this, moment)
      _events.set(getCustomEventId(event.id), eventObj);
    });
  },

  updateEvent(event) {
    let _events = this.get('events');
    let eventId = getCustomEventId(event.id);
    let eventObj = _events.get(eventId);
    if (eventObj) {
      let { startTime, endTime, resourceId } = event;
      eventObj.setProperties({ startTime, endTime, resourceId });
      _events.set(eventId, undefined);
      run.next(() => _events.set(eventId, eventObj))
    } else {
      this.addEvents([event]);
    }
  },

  findEvent(id) {
    let _events = this.get('events');
    let eventId = getCustomEventId(id);
    return _events.get(eventId);
  },

  removeEvent(id) {
    let _events = this.get('events');
    let eventId = getCustomEventId(id);
    let eventObj = _events[eventId];
    if (eventObj) {
      eventObj.destroy();
      _events.set(eventId, undefined);
    }
  },

  deleteAllEvents() {
    let _events = this.get('events');
    Object.values(_events).forEach((eventObj) => eventObj.destroy());
    this.set('events', EmberObject.create());
  },

  refreshCalendar(selectedDate, selectedView) {
    selectedDate && this.set('selectedDate', selectedDate);
    selectedView && this.set('selectedView', selectedView);
    this.deleteAllEvents();
    this.deleteAllResources();
  }

});