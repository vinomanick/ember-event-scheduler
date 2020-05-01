import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('helper:modulus', function(hooks) {
  setupRenderingTest(hooks);

  // Replace this with your real tests.
  test('it renders', async function(assert) {
    await render(hbs`{{modulus 5 2}}`);
    assert.dom(this.element).hasText('1');

    await render(hbs`{{modulus 4 2}}`);
    assert.dom(this.element).hasText('0');
  });
});
