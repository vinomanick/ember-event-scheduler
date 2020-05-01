import { find, render } from '@ember/test-helpers';
import { module, test, skip } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import wait from 'ember-test-helpers/wait';

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

  // TODO: Move to parent component
  skip('should add dragged class when the event is dragged', async function(assert) {
    await render(hbs`{{event-scheduler/external-events/wrappers/event event=event draggable=true}}`);
    let element = find(wrapperElement);
    assert.dom(element).hasAttribute('draggable', 'true');

    let dragStartEvent = new DragEvent('dragstart', {
      view: window, bubbles: true, cancelable: true, dataTransfer: new DataTransfer()
    });
    element.dispatchEvent(dragStartEvent);

    return wait().then(() => {
      assert.deepEqual(JSON.parse(dragStartEvent.dataTransfer.getData('text/data')), {
        id: 1, offset: 4, startTime: '2019-11-27T00:00:00.000Z', endTime: '2019-11-27T01:00:00.000Z'
      });
      assert.dom(element).hasClass('dragged');
    });
  });

  // TODO: Move to parent component
  skip('should remove the dragged class when the drag is stopped', async function(assert) {
    this.set('dragState', 'dragged');
    await render(hbs`{{event-scheduler/external-events/wrappers/event event=event dragState=dragState}}`);
    let element = find(wrapperElement);
    assert.dom(element).hasClass('dragged');

    let dragEndEvent = new DragEvent('dragend', {
      view: window, bubbles: true, cancelable: true, dataTransfer: new DataTransfer()
    });
    element.dispatchEvent(dragEndEvent);
    return wait().then(() => {
      assert.dom(element).doesNotHaveClass('dragged');
    });
  });
});
