import EmberObject, { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import { assert } from '@ember/debug';
import { isPresent } from '@ember/utils';
import { run } from '@ember/runloop';
import { VIEWS } from '../../constants/event-scheduler';
import {
  getSlots,
  getCustomEventId,
  buildCalendarEvent
} from '../../utils/event-scheduler';
import { A } from '@ember/array';
// import { inject as service } from '@ember/service';

export default EmberObject.extend({
  // moment: service(),
  // calendarEvents: undefined,
  // selectedDate: undefined,
  // selectedView: VIEWS.DAY,
  // isExternalEventsExpanded: boolean,
  isLoading: true,
  isEventsDraggable: reads('config.events.draggable'),
  viewType: reads('viewConfig.type'),
  timePickerConfig: reads('config.timePicker'),
  slotInterval: reads('slotConfig.interval'),
  slotFormat: reads('slotConfig.format'),
  slotsLength: reads('slots.length'),
  viewConfig: computed('selectedView', function() {
    let _selectedView = this.selectedView;
    let _views = this.config.views;
    return _views[_selectedView];
  }),
  slotConfig: computed('viewConfig', 'selectedDate', function() {
    if (this.viewType === VIEWS.MONTH) {
      let duration = { format: 'day', value: this.selectedDate.daysInMonth() };
      return Object.assign({ duration }, this.viewConfig.slot);
    }
    return this.viewConfig.slot;
  }),

  slots: computed('viewType', 'selectedDate', function() {
    let _viewType = this.viewType;
    return _viewType === VIEWS.DAY
      ? this.daySlots
      : getSlots(this.selectedDate, this.slotConfig);
  }),
  daySlots: computed(function() {
    return getSlots(this.moment.moment(), this.slotConfig);
  }),

  init() {
    let { config, selectedDate, selectedView, selectedDuration, moment } = this;

    assert('config is required', isPresent(config));
    assert('selected date is required', isPresent(selectedDate));
    assert('selected view is required', isPresent(selectedView));
    assert('selected duration is required', isPresent(selectedDuration));
    assert('moment  is required', isPresent(moment));

    this.set('events', EmberObject.create());
    this.set('resources', A());
  },

  getMonthSlots() {
    let duration = { format: 'day', value: this.selectedDate.daysInMonth() };
    let _slotConfig = this.slotConfig;
    return getSlots(this.selectedDate, Object.assign({ duration }, _slotConfig));
  },

  setDuration(selectedDuration) {
    this.set('selectedDuration', selectedDuration);
  },

  // Resources manipulation
  addResources(resources = []) {
    let calendarResources = this.resources;
    resources.forEach(({ id, name }) => {
      calendarResources.pushObject({ id, name });
    });
  },

  deleteAllResources() {
    this.resources.clear();
  },

  // Events manipulation
  addEvents(events = []) {
    let { events: _events, moment } = this;
    events.forEach((event) => {
      let eventObj = buildCalendarEvent(event, this, moment)
      _events.set(getCustomEventId(event.id), eventObj);
    });
  },

  updateEvent(event) {
    let eventObj = this.findEvent(event.id);
    if (eventObj) {
      eventObj.updateEvent(event);
      this._updateEventsObj(eventObj)
    } else {
      this.addEvents([event]);
    }
  },

  revertEventUpdate(id) {
    let event = this.findEvent(id);
    if (event) {
      event.revertEvent() ? this._updateEventsObj(event) : this.removeEvent(id);
    }
  },

  // Doing this so that the previous wormhole is destroyed and recreated
  _updateEventsObj(event) {
    let eventId = getCustomEventId(event.id);
    let _events = this.events;
    _events.set(eventId, undefined);
    run.next(() => _events.set(eventId, event))
  },

  findEvent(id) {
    let eventId = getCustomEventId(id);
    return this.events.get(eventId);
  },

  removeEvent(id) {
    let event = this.findEvent(id);
    if (event) {
      let eventId = getCustomEventId(id);
      event.destroy();
      this.events.set(eventId, undefined); // This will trigger the observers/computed properties
      delete this.events[eventId]; // This will delete the property from the object
    }
  },

  deleteAllEvents() {
    let _events = this.events;
    Object.values(_events).forEach((eventObj) => eventObj && eventObj.destroy());
    this.set('events', EmberObject.create());
  },

  refreshCalendar(selectedDate, selectedView) {
    this.set('isLoading', true);
    selectedDate && this.set('selectedDate', selectedDate);
    selectedView && this.set('selectedView', selectedView);
    this.deleteAllEvents();
    this.deleteAllResources();
  }

});