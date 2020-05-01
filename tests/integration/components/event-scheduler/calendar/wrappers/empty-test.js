import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | event-scheduler/calendar/wrappers/empty', function(hooks) {
  setupRenderingTest(hooks);

  test('renders', async function(assert) {
    this.set('message', 'No resources to display');
    await render(hbs`{{event-scheduler/calendar/wrappers/empty message=message}}`);
    assert.dom('[data-test-es="empty-row"]').hasText(this.message);

    // Template block usage:
    await render(hbs`
      {{#event-scheduler/calendar/wrappers/empty}}
        template block text
      {{/event-scheduler/calendar/wrappers/empty}}
    `);

    assert.dom('[data-test-es="empty-row"]').hasText('template block text');
  });
});
