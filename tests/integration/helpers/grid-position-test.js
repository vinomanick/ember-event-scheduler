import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('helper:grid-position', function(hooks) {
  setupRenderingTest(hooks);

  // Replace this with your real tests.
  test('it renders', async function(assert) {
    await render(hbs`{{grid-position 1 2 4 5 6 7}}`);

    assert.dom(this.element).hasText('grid-row: 3 / span 4; grid-column: 11 / span 7');
  });
});
