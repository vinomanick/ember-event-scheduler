import Component from '@ember/component';
import layout from '../templates/components/event-scheduler';
import EventScheduler from '../_private/classes/event-scheduler';

export default Component.extend({
  layout,
  classNames: ['event-scheduler'],
  attributeBindings: ['data-test-es'],
  'data-test-es': 'event-scheduler',

  init() {
    this._super(...arguments);
    let { config, selectedDate, selectedView }
      = this.getProperties(['config', 'selectedDate', 'selectedView']);

    let schedulerInst = new EventScheduler({
      config,
      selectedDate,
      selectedView
    });
    this.onSchedulerLoad(schedulerInst);
  }
});
