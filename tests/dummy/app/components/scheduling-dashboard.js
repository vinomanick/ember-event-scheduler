import Component from '@ember/component';
import layout from '../templates/components/scheduling-dashboard';
import { config } from '../constants/scheduling-dashboard';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

const resources = {
  100: { id: 100, name: 'vino'},
  101: { id: 101, name: 'Ram'},
  102: { id: 102, name: 'Sri'},
  103: { id: 103, name: 'Dinesh'},
  104: { id: 104, name: 'Preeti'},
  105: { id: 105, name: 'Swathi'},
  106: { id: 106, name: 'Chira'},
  107: { id: 107, name: 'Ramya'},
  108: { id: 108, name: 'Selvi'},
  109: { id: 109, name: 'Manickam'},
  110: { id: 110, name: 'Venki'},
  111: { id: 111, name: 'Puneet'},
  112: { id: 112, name: 'Sengo'},
  113: { id: 113, name: 'Vignesh'},
  114: { id: 114, name: 'Deepak'},
  115: { id: 115, name: 'Harish'}
}
export default Component.extend({
  moment: service(),
  layout,
  config,
  classNames: ['scheduling-dashboard'],
  attributeBindings: ['data-test-id'],
  'data-test-id': 'scheduling-dashboard',
  selectedDate: computed(function() {
    return this.get('moment').moment().startOf('day');
  }),
  resources: computed(function() {
    return resources;
  }),

});
