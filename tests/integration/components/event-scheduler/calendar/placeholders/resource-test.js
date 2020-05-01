import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | event-scheduler/calendar/placeholders/resource', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    await render(hbs`{{event-scheduler/calendar/placeholders/resource}}`);
    assert.dom('[data-test-es="resource-loader"]').exists();
  });
});
