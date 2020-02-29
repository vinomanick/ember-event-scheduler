import Component from '@ember/component';
import layout from '../templates/components/scheduling-dashboard';
import { config } from '../constants/scheduling-dashboard';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  moment: service(),
  layout,
  config,
  classNames: ['scheduling-dashboard'],
  attributeBindings: ['data-test-id'],
  'data-test-id': 'scheduling-dashboard',
  selectedDate: computed(function() {
    return this.get('moment').moment().startOf('day');
  })
});
