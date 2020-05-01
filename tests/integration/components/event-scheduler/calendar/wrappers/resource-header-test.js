import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | event-scheduler/calendar/wrappers/resource-header', function(hooks) {
  setupRenderingTest(hooks);

  test('renders', async function(assert) {
    this.set('name', 'Resources');
    await render(hbs`{{event-scheduler/calendar/wrappers/resource-header name=name}}`);
    assert.dom('[data-test-es="resource-header"]').hasText(this.name);
  });

  test('yield block content', async function(assert) {
    await render(hbs`
      {{#event-scheduler/calendar/wrappers/resource-header}}
        <div class='heading'>Yielded Heading</div>
      {{/event-scheduler/calendar/wrappers/resource-header}}
    `);
    assert.dom('[data-test-es="resource-header"]').hasText('Yielded Heading');
  });
});
