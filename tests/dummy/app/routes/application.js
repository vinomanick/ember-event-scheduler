import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  intl: service(),
  moment: service(),
  beforeModel() {
    this.intl.setLocale(['en-us']);
    this.moment.setLocale('en');
  }
});
