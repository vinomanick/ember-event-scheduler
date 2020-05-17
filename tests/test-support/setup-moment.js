const setupMoment = (hooks) => {
  hooks.beforeEach(function() {
    // Inject moment service and setting the zone
    this.moment = this.owner.lookup('service:moment');
    this.moment.setTimeZone('Europe/Amsterdam');
    this.moment.setLocale('en');
    this.currentDate = this.moment.moment().startOf('day');
  });
};

export { setupMoment };
