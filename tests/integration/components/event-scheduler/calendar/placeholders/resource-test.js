import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('event-scheduler/calendar/placeholders/resource', 'Integration | Component | event scheduler/calendar/placeholders/resource', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{event-scheduler/calendar/placeholders/resource}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#event-scheduler/calendar/placeholders/resource}}
      template block text
    {{/event-scheduler/calendar/placeholders/resource}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
