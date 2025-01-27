const Notification = {
  install: function(app, args = {}) {
    // ensure the plugin is installed only once
    if (this.installed) return;
    this.installed = true;

    // provide the plugin name
    args.name = typeof args.name === 'string' ? args.name : 'notify';

    // create a new object for notification
    const notify = (params) => {
      // if the params is a string, set it as the message
      if (typeof params === 'string') params = {message: params};

      // notification type: basic, image, list, progress
      params.type = ['basic', 'image', 'list', 'progress'].includes(params.type)
          ? params.type
          : 'basic';
      params.iconUrl = params.iconUrl || 'assets/icon.png';
      // set the notification title
      params.title = params.title || 'Notification Title';
      // set the notification message
      params.message = params.message || 'Notification Message';

      // show it immediately
      if (notify.allowNotification) notify.show(params);
    };

    notify.allowNotification = true;

    notify.show = function(params) {
      // create the notification options
      const options = {
        type: params.type,
        iconUrl: params.iconUrl,
        title: params.title,
        message: params.message,
        priority: 0,
      };

      // show the notification
      throw new Error('show() method not implemented');
    };

    // provide for all components
    app.provide(args.name, notify);
  },
};

export default Notification;
