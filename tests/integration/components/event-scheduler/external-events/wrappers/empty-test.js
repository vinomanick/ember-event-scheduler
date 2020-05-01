import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | event-scheduler/external-events/wrappers/empty', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    this.set('message', 'No events to display');
    await render(hbs`{{event-scheduler/external-events/wrappers/empty message=message}}`);
    assert.dom('[data-test-es="external-events-empty"]').hasText(this.message);

    // Template block usage:
    await render(hbs`
      {{#event-scheduler/external-events/wrappers/empty}}
        template block text
      {{/event-scheduler/external-events/wrappers/empty}}
    `);

    assert.dom('[data-test-es="external-events-empty"]').hasText('template block text');
  });
});
