import { module, test, skip } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

const resource = { id: 1, name: 'Resource 1' };

module('Integration | Component | event-scheduler/calendar/wrappers/resource', function(hooks) {
  setupRenderingTest(hooks);

  test('renders', async function(assert) {
    this.set('resource', resource);
    await render(hbs`{{event-scheduler/calendar/wrappers/resource resource=resource}}`);

    assert.dom('[data-test-es="resource-grid"]').exists();
    assert.dom('[data-test-es="resource-name"]').hasText(resource.name);
  });

  // TODO: Figure out a way to test custom component rendition
  skip('renders custom component', async function(assert) {
    this.setProperties({ resource, customComponent: '' });
    await render(hbs`{{event-scheduler/calendar/wrappers/resource
      resource=resource customComponent=customComponent}}`);

    assert.dom('[data-test-es="resource-grid"]').exists();
    assert.dom('[data-test-es="resource-name"]').doesNotExist();
  });
});
