import { find, render } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

const event = { id: 1, title: 'Event title', startTime: '2019-11-27T00:00:00.000Z', endTime: '2019-11-27T01:00:00.000Z' };

const wrapperElement = '[data-test-es="external-event-wrapper"]';

module('Integration | Component | event-scheduler/external-events/wrappers/event', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.set('event', event);
  });

  // TODO: Add assertions for other elements
  test('renders', async function(assert) {
    await render(hbs`{{event-scheduler/external-events/wrappers/event event=event}}`);
    let eventCard = find(wrapperElement);
    assert.dom('[data-test-es="service-subject"]').hasText(event.title);
    assert.dom(eventCard).doesNotHaveAttribute('draggable');
  });

  test('yield block content', async function(assert) {
    await render(hbs`
      {{#event-scheduler/external-events/wrappers/event}}
        <div>Yielded content</div>
      {{/event-scheduler/external-events/wrappers/event}}
    `);
    assert.dom(wrapperElement).hasText('Yielded content');
  });

  test('should set the event to be draggable when draggable property is set to true', async function(assert) {
    await render(hbs`{{event-scheduler/external-events/wrappers/event event=event draggable=true}}`);
    let element = find(wrapperElement);
    assert.dom(element).hasAttribute('draggable', 'true');
  });
});
