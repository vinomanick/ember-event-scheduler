const setupTranslations = (hooks) => {
  hooks.beforeEach(function() {
    // Inject Translation service and setting the locale
    this.intl = this.owner.lookup('service:intl');
    this.intl.setLocale(['en-us']);
  });
};

export { setupTranslations };
