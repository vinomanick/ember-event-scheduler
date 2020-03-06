import Component from '@ember/component';
import layout from '../templates/components/event-scheduler';
import EventScheduler from '../_private/classes/event-scheduler';
import { inject as service } from '@ember/service';

export default Component.extend({
  intl: service(),
  moment: service(),
  layout,
  classNames: ['event-scheduler'],
  attributeBindings: ['data-test-es'],
  'data-test-es': 'event-scheduler',

  init() {
    this._super(...arguments);
    this.get('intl').setLocale(['en-us']);
    let { config, selectedDate, selectedView, selectedDuration, moment }
      = this.getProperties(['config', 'selectedDate', 'selectedView', 'selectedDuration', 'moment']);

    let schedulerInst = new EventScheduler({
      config,
      selectedDate,
      selectedView,
      selectedDuration,
      moment
    });
    this.set('calendarInst', schedulerInst.get('calendar'));
    this.set('externalEventsInst', schedulerInst.get('externalEvents'));
    this.onSchedulerLoad(schedulerInst);
  },

  actions: {
    updateExternalEventAndBubble(updatedEvent) {
      this.get('externalEventsInst').updateEvent(updatedEvent);
      this.onEventDrop(updatedEvent);
    }
  }
});
