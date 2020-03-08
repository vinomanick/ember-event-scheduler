import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('event-scheduler/external-events/placeholders/event', 'Integration | Component | event scheduler/external events/placeholders/event', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{event-scheduler/external-events/placeholders/event}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#event-scheduler/external-events/placeholders/event}}
      template block text
    {{/event-scheduler/external-events/placeholders/event}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
