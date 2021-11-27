module.exports = {
  "src_folders" : ["tests"],

  "page_objects_path": [
    "pages"
  ],

  "custom_commands_path": "commands",

  "screenshots": {
    "enabled": true,
    "on_failure": true,
    "on_error": true,
    "path": "./screenshots"
  },

  "webdriver" : {
    "start_process": true,
    "server_path": require('chromedriver').path,
    "port": 9515
  },

  "test_settings" : {
    "default" : {
      "desiredCapabilities": {
        "browserName": "chrome",
        "chromeOptions": {
          "args": [
            "window-size=1280,800"
          ]
        }
      }
    }
  }
};
