import Mixin from '@ember/object/mixin';
import {
  getEventMandates
} from 'ember-event-scheduler/utils/event-scheduler';
import { run } from '@ember/runloop';
import EmberObject, { setProperties } from '@ember/object';

const TYPES = {
  EVENT: 'event',
  EXTERNAL_EVENT: 'external_event',
  RESOURCE: 'resource'
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
    let _data = this.get(type);
    let { id } = item;
    let _item = _data.get(id);
    if (_item) {
      if (type === TYPES.EVENT) {

        // This will be help during event revert
        _item._prevData = getEventMandates(_item);

        // Doing this so that the previous wormhole is destroyed and recreated
        _data.set(id, undefined);
        run.next(() => _data.set(id, _item));

      } else {
        _data.set(id, _item);
      }
    } else {
      this.add(type, [item]);
    }
  },

  revertEvent(id) {
    let _events = this.events;
    let event = _events.get(id);
    if (event) {
      this._revertEvent(event) ? this.update(TYPES.EVENT, event) : this.delete(TYPES.EVENT, id);
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
