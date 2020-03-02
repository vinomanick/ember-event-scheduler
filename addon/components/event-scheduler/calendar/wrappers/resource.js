import Component from '@ember/component';
import layout from '../../../../templates/components/event-scheduler/calendar/wrappers/resource';
import { get, computed } from '@ember/object';

export default Component.extend({
  layout,
  classNames: ['calendar__row'],
  attributeBindings: ['data-test-es'],
  'data-test-es': computed(function() {
    return `resource_${get(this, 'resource.id')}`;
  })
});
