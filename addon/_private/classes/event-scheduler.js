import EmberObject from '@ember/object';
import { assert } from '@ember/debug';
import { isPresent } from '@ember/utils';
import Calendar from './calendar';

export default EmberObject.extend({
  // calendar: undefined,
  // externalEvents: undefined,

  init() {
    let { config, selectedDate, selectedView, selectedDuration, moment }
      = this.getProperties(['config', 'selectedDate', 'selectedView', 'selectedDuration', 'moment']);
    assert('selected date is required', isPresent(selectedDate));
    assert('selected view is required', isPresent(selectedView));
    assert('selected duration is required', isPresent(selectedDuration));
    assert('config is required', isPresent(config));
    assert('moment  is required', isPresent(moment));

    this.set('calendar', new Calendar({
      config,
      selectedDate,
      selectedView,
      selectedDuration,
      moment
    }));
  }
});