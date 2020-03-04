import EmberObject from '@ember/object';
import { assert } from '@ember/debug';
import { isPresent } from '@ember/utils';
import Calendar from './calendar';
import ExternalEvents from './external-events';

export default EmberObject.extend({
  // calendar: undefined,
  // externalEvents: undefined,

  init() {
    let { config, selectedDate, selectedView, moment }
      = this.getProperties(['config', 'selectedDate', 'selectedView', 'moment']);
    assert('selected date is required', isPresent(selectedDate));
    assert('selected view is required', isPresent(selectedView));
    assert('config is required', isPresent(config));
    assert('moment  is required', isPresent(moment));

    this.set('calendar', Calendar.create({
      config,
      selectedDate,
      selectedView,
      moment
    }));

    this.set('externalEvents', ExternalEvents.create());
  }
});