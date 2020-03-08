import Component from '@ember/component';
import layout from '../../../../templates/components/event-scheduler/calendar/placeholders/resource';

export default Component.extend({
  layout,
  classNames: ['calendar__row calendar__row--place-holder'],
  attributeBindings: ['data-test-es'],
  'data-test-es': 'resource-loader'
});
