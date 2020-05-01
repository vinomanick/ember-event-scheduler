import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | event-scheduler/external-events/placeholders/event', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    await render(hbs`{{event-scheduler/external-events/placeholders/event}}`);
    assert.dom('[data-test-es="external-event-loader"]').exists();
  });
});
