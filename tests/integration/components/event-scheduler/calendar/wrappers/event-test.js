import { find, render } from '@ember/test-helpers';
import { module, test, skip } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { getEventPosition } from 'dummy/tests/helpers/utils/scheduler-util';

const wrapperElement = '[data-test-es="event-wrapper"]';

module('Integration | Component | event-scheduler/calendar/wrappers/event', function(hooks) {
  setupRenderingTest(hooks);

  let event, currentDate;

  hooks.beforeEach(function() {
    // Inject moment service and setting the zone
    this.moment = this.owner.lookup('service:moment');
    this.get('moment').setTimeZone('Europe/Amsterdam');
    currentDate = this.get('moment').moment().startOf('day');

    event = {
      id: '1',
      resourceId: '101',
      title: 'First event for Resource 1',
      startTime: currentDate.clone().set({ h: 2, m: 0 }),
      endTime: currentDate.clone().set({ h: 3, m: 0 })
    };

    this.setProperties({
      slotsLength: 48,
      viewType: 'day',
      slotInterval: { value: 30, format: 'minute' },
      draggable: true,
      selectedDate: currentDate,
      event
    });
  });

  test('renders', async function(assert) {
    await render(hbs`
    <div data-resource-id="101"></div>
    {{event-scheduler/calendar/wrappers/event draggable=draggable viewType=viewType
      slotsLength=slotsLength slotInterval=slotInterval event=event selectedDate=selectedDate
    }}`);
    let eventWrapper = find(wrapperElement);
    assert.ok(eventWrapper);
    let { startPosition, endPosition } = getEventPosition(eventWrapper);
    assert.equal(startPosition, '5');
    assert.equal(endPosition, '7');
    assert.dom('[data-test-es="event-title"]').hasText(event.title);
  });

  //TODO update this to use custom component
  skip('render custom component content', async function(assert) {
    this.set('customComponent', '');
    await render(hbs`
      <div data-resource-id="101"></div>
      {{event-scheduler/calendar/wrappers/event draggable=draggable viewType=viewType
        slotsLength=slotsLength slotInterval=slotInterval event=event selectedDate=selectedDate
        customComponent=customComponent}}`);
    let eventWrapper = find(wrapperElement);
    assert.ok(eventWrapper);
    let { startPosition, endPosition } = getEventPosition(eventWrapper);
    assert.equal(startPosition, '5');
    assert.equal(endPosition, '7');
    assert.dom(eventWrapper).hasText('Yielded event data');
  });

  module('event display criteria checks', function() {
    test('should not render the event if the resource grid is not present in the dom', async function(assert) {
      await render(hbs`
        {{event-scheduler/calendar/wrappers/event draggable=draggable viewType=viewType
          slotsLength=slotsLength slotInterval=slotInterval event=event selectedDate=selectedDate
        }}`);
      assert.dom(wrapperElement).doesNotExist();
    });

    test('should not render the event if both start and end time are less than the current time window', async function(assert) {
      event.startTime = currentDate.clone().subtract(24, 'h');
      event.endTime = currentDate.clone().subtract(23, 'h');
      this.set('event', event);
      await render(hbs`
        <div data-resource-id="101"></div>
        {{event-scheduler/calendar/wrappers/event draggable=draggable viewType=viewType
          slotsLength=slotsLength slotInterval=slotInterval event=event selectedDate=selectedDate
        }}`);
      assert.dom(wrapperElement).doesNotExist();
    });

    test('should not render the event if both start and end time are greater than the current time window', async function(assert) {
      event.startTime = currentDate.clone().add(25, 'h');
      event.endTime = currentDate.clone().add(28, 'h');
      this.set('event', event);
      await render(hbs`
        <div data-resource-id="101"></div>
        {{event-scheduler/calendar/wrappers/event draggable=draggable viewType=viewType
          slotsLength=slotsLength slotInterval=slotInterval event=event selectedDate=selectedDate
        }}`);
      assert.dom(wrapperElement).doesNotExist();
    });
  });

  module('multiday spanning events render checks', function() {
    test('should render as left extended element if start time is not in the current time window and end time is in the current time window', async function(assert) {
      event.startTime = currentDate.clone().subtract(1, 'h');
      event.endTime = currentDate.clone().add(1, 'h');
      this.set('event', event);
      await render(hbs`
        <div data-resource-id="101"></div>
        {{event-scheduler/calendar/wrappers/event draggable=draggable viewType=viewType
          slotsLength=slotsLength slotInterval=slotInterval event=event selectedDate=selectedDate
        }}`);
      let eventWrapper = find(wrapperElement);
      assert.ok(eventWrapper);
      let { startPosition, endPosition } = getEventPosition(eventWrapper);
      assert.dom(eventWrapper).hasClass('extended-left');
      assert.equal(startPosition, '1');
      assert.equal(endPosition, '3');
    });

    test('should render as right extended element if start time is in the current time window and end time is not in the current time window', async function(assert) {
      event.startTime = currentDate.clone().add(23, 'h');
      event.endTime = currentDate.clone().add(25, 'h');
      this.set('event', event);
      await render(hbs`
        <div data-resource-id="101"></div>
        {{event-scheduler/calendar/wrappers/event draggable=draggable viewType=viewType
          slotsLength=slotsLength slotInterval=slotInterval event=event selectedDate=selectedDate
        }}`);
      let eventWrapper = find(wrapperElement);
      assert.ok(eventWrapper);
      let { startPosition, endPosition } = getEventPosition(eventWrapper);
      assert.dom(eventWrapper).hasClass('extended-right');
      assert.equal(startPosition, '47');
      assert.equal(endPosition, '49');
    });

    test('should render as both extended element if start time is less and end time is greater than the current time window', async function(assert) {
      event.startTime = currentDate.clone().subtract(1, 'h');
      event.endTime = currentDate.clone().add(25, 'h');
      this.set('event', event);
      await render(hbs`
        <div data-resource-id="101"></div>
        {{event-scheduler/calendar/wrappers/event draggable=draggable viewType=viewType
          slotsLength=slotsLength slotInterval=slotInterval event=event selectedDate=selectedDate
        }}`);
      let eventWrapper = find(wrapperElement);
      assert.ok(eventWrapper);
      let { startPosition, endPosition } = getEventPosition(eventWrapper);
      assert.dom(eventWrapper).hasClass('extended-left');
      assert.dom(eventWrapper).hasClass('extended-right');
      assert.equal(startPosition, '1');
      assert.equal(endPosition, '49');
    });
  });
});
