import EmberObject from '@ember/object';
import { reads } from '@ember/object/computed';
import { assert } from '@ember/debug';
import { isPresent } from '@ember/utils';

export default EmberObject.extend({
  calendar: undefined,
  externalEvents: reads('slotConfig.internal'),
  slotsLength: reads('slots.length'),

  init() {
    assert('selected date is required', isPresent(this.get('selectedDate')));
    assert('slotConfig is required', isPresent(this.get('config')));
    assert('slots is required', isPresent(this.get('slots')));

    this.set('calendarEvents', new Map());
  }
});