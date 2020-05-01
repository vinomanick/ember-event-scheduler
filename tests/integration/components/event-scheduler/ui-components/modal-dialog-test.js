import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | event-scheduler/ui-components/modal-dialog', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Template block usage:
    await render(hbs`
      <div id="es-app-overlays" class="es-app-overlays"></div>
      {{#event-scheduler/ui-components/modal-dialog as |dialog|}}
        {{#dialog.header}}
          Header text
        {{/dialog.header}}
        {{#dialog.body}}
          Body text
        {{/dialog.body}}
        {{#dialog.footer}}
          Footer text
        {{/dialog.footer}}
      {{/event-scheduler/ui-components/modal-dialog}}
    `);

    assert.dom('[data-test-es="modal-overlay-header"]').hasText('Header text');
    assert.dom('[data-test-es="modal-overlay-body"]').hasText('Body text');
    assert.dom('[data-test-es="modal-overlay-footer"]').hasText('Footer text');
  });
});
