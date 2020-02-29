import Component from '@ember/component';
import layout from '../../templates/components/event-scheduler/calendar';
import { computed, get } from '@ember/object';
import { VIEWS } from '../../constants/event-scheduler';
import { reads } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { getSlots } from '../../utils/event-scheduler';

export default Component.extend({
  moment: service(),
  layout,
  classNames: ['es-calendar'],
  classNameBindings: ['viewClass'],
  attributeBindings: ['data-test-es'],
  'data-test-es': 'es-calendar',
  viewType: reads('viewConfig.type'),
  slotConfig: reads('viewConfig.slot'),
  viewClass: computed('viewType', function() {
    return `${get(this, 'viewType')}-view`;
  }),
  viewConfig: computed('selectedView', function() {
    let _selectedView = get(this, 'selectedView');
    let _views = get(this, 'config.views');
    return _views[_selectedView];
  }),
  daySlots: computed(function() {
    let startOf = VIEWS.DAY;
    let { duration, interval,  startAt } = get(this, 'slotConfig');
    return getSlots(get(this, 'moment').moment(), { duration, interval, startAt, startOf });
  }),
  slots: computed('viewType', 'selectedDate', function() {
    let _viewType = get(this, 'viewType');
    let { duration, interval,  startAt } = get(this, 'slotConfig');
    return _viewType === VIEWS.DAY
      ? get(this, 'daySlots')
      : getSlots(get(this, 'selectedDate'), { duration, interval, startAt, startOf: _viewType });
  })
});
