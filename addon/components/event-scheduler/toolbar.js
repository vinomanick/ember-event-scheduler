import Component from '@ember/component';
import layout from '../../templates/components/event-scheduler/toolbar';
import { reads } from '@ember/object/computed';

export default Component.extend({
  layout,
  classNames: ['es-toolbar'],
  attributeBindings: ['data-test-es'],
  'data-test-es': 'es-toolbar',
  toolbarConfig: reads('config.toolbar')
});
