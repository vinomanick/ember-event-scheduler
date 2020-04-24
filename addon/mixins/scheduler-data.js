import Mixin from '@ember/object/mixin';
import {
  getEventMandates
} from 'ember-event-scheduler/utils/event-scheduler';
import { run } from '@ember/runloop';
import EmberObject, { setProperties } from '@ember/object';

const TYPES = {
  EVENT: 'events',
  EXTERNAL_EVENT: 'externalEvents',
  RESOURCE: 'resources'
};

export default Mixin.create({
  init() {
    this._super(...arguments);
    this.setProperties( {
      events: EmberObject.create(),
      externalEvents: EmberObject.create(),
      resources: EmberObject.create()
    });
  },

  add(type, data = []) {
    let _data = this.get(type);
    data.forEach((item) => {
      _data.set(item.id, item);
    });
  },

  update(type, item) {
    if (type === TYPES.EVENT) {
      this._updateEvent(item);
      this._updateExternalEvent(item);
    } else if (type === TYPES.EXTERNAL_EVENT) {
      this._updateExternalEvent(item);
    }
  },

  _updateEvent(event) {
    let _events = this.events;
    let { id } = event;
    let _event = _events[event.id];
    if (_event) {
      _event._prevData = getEventMandates(_event);
      let { startTime, endTime, resourceId } = event;
      setProperties(_event, { startTime, endTime, resourceId });
      _events.set(id, undefined);
      run.next(() => _events.set(id, _event))
    } else {
      this.add(TYPES.EVENT, [event]);
    }
  },

  _updateExternalEvent(event) {
    let _events = this.externalEvents;
    let _event = _events[event.id];
    if (_event) {
      let { startTime, endTime, resourceId } = event;
      setProperties(_event, { startTime, endTime, resourceId });
    }
  },

  revertEvent(id) {
    let _events = this.events;
    let event = _events.get(id);
    if (event) {
      this._revertEvent(event) ? this.update(TYPES.EVENT, event) : this.delete(TYPES.EVENT, id);
      this.update(TYPES.EXTERNAL_EVENT, event)
    }
  },

  _revertEvent(event) {
    let _prevData = event._prevData;
    if (_prevData) {
      let { startTime, endTime, resourceId } = _prevData;
      setProperties(event, { startTime, endTime, resourceId, _prevData: null });
      return true;
    }
    return false;
  },

  delete(type, id) {
    let _data = this.get(type);
    if (_data.get(id)) {
      _data.set(id, undefined); // This will trigger the observers/computed properties
      delete _data[id]; // This will delete the property from the object
    }
  },


  deleteAll(types) {
    types.forEach((type) => this.set(type, EmberObject.create()));
  }
});
