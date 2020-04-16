import AddonDocsRouter, { docsRoute } from 'ember-cli-addon-docs/router';
import config from './config/environment';

const Router = AddonDocsRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('demo');
  docsRoute(this, function() {
    this.route('usage');
    this.route("components", function() {
      this.route("event-scheduler");
    });
  });
  this.route('not-found', { path: '/*path' });
});

export default Router;
