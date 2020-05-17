import { find, render } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import wait from 'ember-test-helpers/wait';

const event = {
  id: 1,
  offset: 4,
  startTime: '2019-01-03T08:00:00.000Z',
  endTime: '2019-01-03T09:00:00.000Z'
};

const renderComponent = async () => {
  await render(hbs` {{event-scheduler/calendar/wrappers/event/event-card
    event=event
    draggable=draggable
    dragState=dragState
    slotsLength=slotsLength
    startPosition=startPosition
    endPosition=endPosition }}`);
};

const wrapperElement = '[data-test-es="event-wrapper"]';

module('Integration | Component | event-scheduler/calendar/wrappers/event/event-card', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.setProperties({
      slotsLength: 48,
      startPosition: 4,
      endPosition: 8,
      draggable: true,
      event
    });
  });

  test('renders', async function(assert) {
    this.set('draggable', false);
    await renderComponent();
    let eventCard = find(wrapperElement);
    assert.ok(eventCard);
    assert.dom(eventCard).hasAttribute('draggable', 'false');
  });

  test('should set the event to be draggable when draggable property is set to true', async function(assert) {
    await renderComponent();
    let eventCard = find(wrapperElement);
    assert.ok(eventCard);
    assert.dom(eventCard).hasAttribute('draggable', 'true');
  });

  test('should add dragged class when the event is dragged', async function(assert) {
    await renderComponent();
    let element = find(wrapperElement);
    assert.dom(element).hasAttribute('draggable', 'true');

    let dragStartEvent = new DragEvent('dragstart', {
      view: window, bubbles: true, cancelable: true, dataTransfer: new DataTransfer()
    });
    element.dispatchEvent(dragStartEvent);

    return wait().then(() => {
      assert.deepEqual(JSON.parse(dragStartEvent.dataTransfer.getData('text/data')), event);
      assert.dom(element).hasClass('dragged');
    });
  });

  test('should remove the dragged class when the drag is stopped', async function(assert) {
    this.set('dragState', 'dragged');
    await renderComponent();
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
