import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { selectChoose } from 'ember-power-select/test-support/helpers';
import hbs from 'htmlbars-inline-precompile';
import { DEFAULT_CONFIG } from 'dummy/tests/constants/event-scheduler';
import sinon from 'sinon';

module('Integration | Component | event-scheduler/toolbar/wrappers/right-panel', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    let { toolbar: { duration: durationConfig }, defaultView: selectedView, views } = DEFAULT_CONFIG();

    this.setProperties({
      durationConfig,
      selectedView,
      selectedDuration: durationConfig.default,
      views,
      onDurationChangeSpy: sinon.spy(),
      onViewChangeSpy: sinon.spy()
    });
  });

  // TODO: Assert with intl translation
  test('should trigger the change duration action on changing the default duration', async function(assert) {
    await render(hbs`{{event-scheduler/toolbar/wrappers/right-panel
      selectedDuration=selectedDuration selectedView=selectedView
      views=views durationConfig=durationConfig
      onViewChange=(action onViewChangeSpy)
      onDurationChange=(action onDurationChangeSpy)
    }}`);
    assert.dom('[data-test-es="event-duration"] .ember-power-select-selected-item').hasText('60 minutes');
    await selectChoose('[data-test-es="event-duration"]', '.ember-power-select-option', 2);
    assert.deepEqual(this.onDurationChangeSpy.args[0][0], { value: 90, format: 'minute' });
  });

  // TODO: Assert with intl translation
  test('should trigger the change view action on changing the view', async function(assert) {
    await render(hbs`{{event-scheduler/toolbar/wrappers/right-panel
      selectedDuration=selectedDuration selectedView=selectedView
      views=views durationConfig=durationConfig
      onViewChange=(action onViewChangeSpy)
      onDurationChange=(action onDurationChangeSpy)
    }}`);
    assert.dom('[data-test-es="view-type"] .ember-power-select-selected-item').hasText('Day');
    await selectChoose('[data-test-es="view-type"]', '.ember-power-select-option', 1);
    assert.equal(this.onViewChangeSpy.calledWith('week'), true);
  });
});
