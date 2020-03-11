import Component from '@ember/component';
import layout from '../templates/components/event-scheduler';
import EventScheduler from '../_private/classes/event-scheduler';
import { inject as service } from '@ember/service';
import { and } from '@ember/object/computed';

export default Component.extend({
  intl: service(),
  moment: service(),
  layout,
  classNames: ['event-scheduler'],
  attributeBindings: ['data-test-es'],
  'data-test-es': 'event-scheduler',
  canShowExternalEvents: and('config.hasExternalEvents', 'calendarInst.isExternalEventsExpanded'),

  init() {
    this._super(...arguments);
    this.intl.setLocale(['en-us']);
    this.moment.setTimeZone('America/Santiago');

    let { config, selectedDate, selectedView, selectedDuration, isExternalEventsExpanded, moment }
      = this;

    let schedulerInst = EventScheduler.create({
      config,
      selectedDate,
      selectedView,
      selectedDuration,
      isExternalEventsExpanded,
      moment
    });
    this.set('calendarInst', schedulerInst.calendar);
    this.set('externalEventsInst', schedulerInst.externalEvents);
    this.onSchedulerLoad(schedulerInst);
  },

  actions: {
    updateExternalEventAndBubble(updatedEvent) {
      this.externalEventsInst.updateEvent(updatedEvent);
      this.onEventDrop(updatedEvent);
    }
  }
});
