import Component from '@ember/component';
import layout from '../templates/components/event-scheduler';
import EventScheduler from '../_private/classes/event-scheduler';
import { inject as service } from '@ember/service';

export default Component.extend({
  moment: service(),
  layout,
  classNames: ['event-scheduler'],
  attributeBindings: ['data-test-es'],
  'data-test-es': 'event-scheduler',

  init() {
    this._super(...arguments);
    let { config, selectedDate, selectedView, moment }
      = this.getProperties(['config', 'selectedDate', 'selectedView', 'moment']);

    let schedulerInst = new EventScheduler({
      config,
      selectedDate,
      selectedView,
      moment
    });
    this.set('calendarInst', schedulerInst.get('calendar'));
    this.set('externalEventsInst', schedulerInst.get('externalEvents'));
    this.onSchedulerLoad(schedulerInst);
  }
});
