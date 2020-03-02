import EmberObject from '@ember/object';
import { assert } from '@ember/debug';
import { isPresent } from '@ember/utils';
import Calendar from './calendar';

export default EmberObject.extend({
  // calendar: undefined,
  // externalEvents: undefined,

  init() {
    let { config, selectedDate, selectedView }
      = this.getProperties(['config', 'selectedDate', 'selectedView'])
    assert('selected date is required', isPresent(selectedDate));
    assert('selected view is required', isPresent(selectedView));
    assert('config is required', isPresent(config));

    this.set('calendar', new Calendar({
      config,
      selectedDate,
      selectedView
    }));
  }
});