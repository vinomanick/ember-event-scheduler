import Component from '@ember/component';
import layout from '../templates/components/event-scheduler';
import PublicAPI from 'ember-event-scheduler/utils/public-api';
import { inject as service } from '@ember/service';
import EmberObject, { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import { DEFAULT_CONFIG } from '../constants/event-scheduler';
import { assign } from '@ember/polyfills';
import { VIEWS } from 'ember-event-scheduler/constants/event-scheduler';
import schedulerData from 'ember-event-scheduler/mixins/scheduler-data';
import { getSlots } from 'ember-event-scheduler/utils/event-scheduler';
import { run } from '@ember/runloop';

const schedulerAPI = {
  slots: 'slots',
  viewType: 'viewType',
  actions: {
    add: 'add',
    update: 'update',
    revertEvent: 'revertEvent',
    delete: 'delete',
    deleteAll: 'deleteAll',
    resetCalendar: 'resetCalendar',
    resetExternalEvents: 'resetExternalEvents',
  }
};

export default Component.extend(schedulerData, {
  intl: service(),
  moment: service(),
  layout,
  classNames: ['event-scheduler'],
  attributeBindings: ['data-test-es'],
  'data-test-es': 'event-scheduler',
  viewType: reads('viewConfig.type'),
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

  slots: computed('viewType', 'selectedDate', function() {
    let _viewType = this.viewType;
    return _viewType === VIEWS.DAY
      ? this.daySlots
      : getSlots(this.selectedDate, this.slotConfig);
  }),

  daySlots: computed(function() {
    return getSlots(this.moment.moment(), this.slotConfig);
  }),

  init() {
    this._super(...arguments);
    this.intl.setLocale(['en-us']);
    this.moment.setTimeZone('America/Santiago');

    this.publicAPI = new PublicAPI(this, schedulerAPI);

    if(!this.selectedDate) {
      this.selectedDate = this.moment.moment();
    }
    if(!this.selectedView) {
      this.selectedView = this.config.defaultView;
    }
    if(!this.selectedDuration) {
      this.selectedDuration = this.config.toolbar.duration.default;
    }

    this.setProperties( {
      events: EmberObject.create(),
      externalEvents: EmberObject.create(),
      resources: EmberObject.create()
    });

    run.next(() => this.onSchedulerLoad(this.publicAPI))

  },

  onSchedulerLoad() {},
  onEventDrop() {},

  actions: {
    triggerEventDrop(updatedEvent) {
      this._updateEvent(updatedEvent);
      this._updateExternalEvent(updatedEvent);
      this.onEventDrop(updatedEvent);
    }
  }
});
