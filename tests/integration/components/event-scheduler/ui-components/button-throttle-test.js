import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('event-scheduler/ui-components/button-throttle', 'Integration | Component | event scheduler/ui components/button throttle', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{event-scheduler/ui-components/button-throttle}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#event-scheduler/ui-components/button-throttle}}
      template block text
    {{/event-scheduler/ui-components/button-throttle}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
