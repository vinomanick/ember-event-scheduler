import Component from '@ember/component';
import layout from '../templates/components/scheduling-dashboard';
import { config } from '../constants/scheduling-dashboard';

export default Component.extend({
  layout,
  config,
  classNames: ['scheduling-dashboard'],
  attributeBindings: ['data-test-id'],
  'data-test-id': 'scheduling-dashboard',
});
