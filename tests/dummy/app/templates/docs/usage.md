# Usage

## Requirements
* `node` 10 and above
* `ember-cli & ember-source` **2.18** and above
* `ember-moment` v8.0.0 or above
* `ember-power-select` v2.3.5 or above
* `ember-power-calendar` v0.13.3
* `ember-intl` v4.2.4 or above

## Installation
### Installing Homebrew on Mac
Follow the steps on [Homebrew](https://brew.sh/)

### Installing node via Homebrew

To install latest node:
```sh
brew install node
```
---
### Installing ember-cli

To install ember-cli globally you must do the following:
```sh
npm install -g ember-cli
```
---
### Installing event scheduler
To use event scheduler in your projects, you need to install the addons via ember install:

```sh
ember install ember-intl ember-moment ember-power-calendar-moment ember-power-calendar@0.13.3 ember-power-select@^2.3.5  ember-event-scheduler
```

We are dependent on ember-power-select and ember-power-calendar for the toolbar actions to work. So
we need to follow the steps mentioned in their respective site.

For ember-power-select: [Installation steps](https://2-x.ember-power-select.com/docs/installation/)
For ember-power-calendar: [Installation steps](https://ember-power-calendar.com/docs/installation)

Check the corresponding component's documentation page for more details.
