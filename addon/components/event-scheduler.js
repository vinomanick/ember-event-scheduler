import Component from '@ember/component';
import layout from '../templates/components/event-scheduler';
import PublicAPI from '../_private/classes/public-api';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { and } from '@ember/object/computed';
import { DEFAULT_CONFIG } from '../constants/event-scheduler';
import { assign } from '@ember/polyfills';
import { VIEWS } from 'ember-event-scheduler/constants/event-scheduler';

const schedulerAPI = {
  id: 'mapId',
  map: 'map',
  components: 'components',
  actions: {
    update: '_updateMap',
    trigger: '_trigger',
  }
};

export default Component.extend({
  intl: service(),
  moment: service(),
  layout,
  classNames: ['event-scheduler'],
  attributeBindings: ['data-test-es'],
  'data-test-es': 'event-scheduler',
  canShowExternalEvents: and('config.hasExternalEvents', 'isExternalEventsExpanded'),
  defaultConfig: computed(function() {
    return DEFAULT_CONFIG();
  }),

  config: computed('options', function() {
    return assign({}, this.defaultConfig, this.options);
  }),

  viewConfig: computed('selectedView', function() {
    let _selectedView = this.selectedView;
    let _views = this.config.views;
    return _views[_selectedView];
  }),

  slotConfig: computed('viewConfig', 'selectedDate', function() {
    if (this.viewType === VIEWS.MONTH) {
      let duration = { format: 'day', value: this.selectedDate.daysInMonth() };
      return Object.assign({ duration }, this.viewConfig.slot);
    }
    return this.viewConfig.slot;
  }),

  init() {
    this._super(...arguments);
    this.intl.setLocale(['en-us']);
    this.moment.setTimeZone('America/Santiago');

    this.publicAPI = PublicAPI.create({
      instance: this,
      schema: schedulerAPI
    });

    if(!this.selectedDate) {
      this.selectedDate = this.moment.moment();
    }
    if(!this.selectedView) {
      this.selectedView = this.config.defaultView;
    }
    if(!this.selectedDuration) {
      this.selectedDuration = this.config.toolbar.duration.default;
    }

    // this.onSchedulerLoad(schedulerInst);
  },

  onSchedulerLoad() {},
  onCalendarRefresh() {},
  onEventDrop() {},

  actions: {
    updateExternalEventAndBubble(updatedEvent) {
      this.externalEventsInst.updateEvent(updatedEvent);
      this.onEventDrop(updatedEvent);
    }
  }
});
