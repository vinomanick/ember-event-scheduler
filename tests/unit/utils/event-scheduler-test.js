import { getEventPeriodCompact } from 'ember-event-scheduler/utils/event-scheduler';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Utility | event scheduler', function(hooks) {
  setupTest(hooks);

  test('#getEventPeriodCompact() - should return the compact appointment time', function(assert) {
    let moment = this.owner.lookup('service:moment');
    moment.setTimeZone('Europe/Amsterdam');
    let currentDate = moment.moment().startOf('day');

    assert.equal(getEventPeriodCompact(currentDate.clone().add(1, 'h').toISOString(),
      currentDate.clone().add(2, 'h').toISOString(), moment), '1 - 2am');

    assert.equal(getEventPeriodCompact(currentDate.clone().add(90, 'm').toISOString(),
      currentDate.clone().add(2, 'h').toISOString(), moment), '1:30 - 2am');

    assert.equal(getEventPeriodCompact(currentDate.clone().add(11, 'h').toISOString(),
      currentDate.clone().add(13, 'h').toISOString(), moment), '11am - 1pm');

    let startDate = currentDate.clone().add(1, 'h');
    let endDate = currentDate.clone().add(26, 'h');
    let expectedOutput = `${startDate.format('D MMM')} 1am - ${endDate.format('D MMM')} 2am`;
    assert.equal(getEventPeriodCompact(startDate.toISOString(),
      endDate.toISOString(), moment), expectedOutput);
  });
});
