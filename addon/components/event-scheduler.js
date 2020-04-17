import Component from '@ember/component';
import layout from '../templates/components/event-scheduler';
import EventScheduler from '../_private/classes/event-scheduler';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { and } from '@ember/object/computed';
import { DEFAULT_CONFIG } from '../constants/event-scheduler';
import { assign } from '@ember/polyfills';

export default Component.extend({
  intl: service(),
  moment: service(),
  layout,
  classNames: ['event-scheduler'],
  attributeBindings: ['data-test-es'],
  'data-test-es': 'event-scheduler',
  canShowExternalEvents: and('config.hasExternalEvents', 'calendarInst.isExternalEventsExpanded'),
  defaultConfig: computed(function() {
    return DEFAULT_CONFIG();
  }),
  today: computed(function() {
    return this.moment.moment();
  }),
  config: computed('options', function() {
    return assign(this.defaultConfig, this.options);
  }),
  init() {
    this._super(...arguments);
    this.intl.setLocale(['en-us']);
    this.moment.setTimeZone('America/Santiago');

    let { config, moment, isExternalEventsExpanded }
      = this;

    let selectedDate = this.selectedDate || this.today;
    let selectedView = this.selectedView || config.defaultView;
    let selectedDuration = this.selectedDuration || config.toolbar.duration.default;

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

  onSchedulerLoad() {},
  onEventDrop() {},

  actions: {
    updateExternalEventAndBubble(updatedEvent) {
      this.externalEventsInst.updateEvent(updatedEvent);
      this.onEventDrop(updatedEvent);
    }
  }
});
