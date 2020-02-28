import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('event-scheduler/calendar/wrappers/grid-header', 'Integration | Component | event scheduler/calendar/wrappers/grid header', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{event-scheduler/calendar/wrappers/grid-header}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#event-scheduler/calendar/wrappers/grid-header}}
      template block text
    {{/event-scheduler/calendar/wrappers/grid-header}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
