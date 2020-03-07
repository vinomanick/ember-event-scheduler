import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('event-scheduler/toolbar/wrappers/center-panel', 'Integration | Component | event scheduler/toolbar/wrappers/center panel', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{event-scheduler/toolbar/wrappers/center-panel}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#event-scheduler/toolbar/wrappers/center-panel}}
      template block text
    {{/event-scheduler/toolbar/wrappers/center-panel}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
