import Mixin from '@ember/object/mixin';
import {
  getCustomEventId,
  buildCalendarEvent
} from 'ember-event-scheduler/utils/event-scheduler';
import { run } from '@ember/runloop';
import EmberObject from '@ember/object';

export default Mixin.create({
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
    let { events: calendarEvents, moment } = this;
    events.forEach((event) => {
      let eventObj = buildCalendarEvent(event, this, moment)
      calendarEvents.set(getCustomEventId(event.id), eventObj);
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
  }
});
