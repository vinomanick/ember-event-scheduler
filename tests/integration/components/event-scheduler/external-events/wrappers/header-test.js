import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | event-scheduler/external-events/wrappers/header', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    this.set('name', 'External events');

    await render(hbs`{{event-scheduler/external-events/wrappers/header name=name}}`);
    assert.dom('[data-test-es="external-events-header"]').hasText(this.name);

    // Template block usage:
    await render(hbs`
      {{#event-scheduler/external-events/wrappers/header}}
        <div>Yielded heading</div>
      {{/event-scheduler/external-events/wrappers/header}}
    `);
    assert.dom('[data-test-es="external-events-header"]').hasText('Yielded heading');
  });
});
