cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
  {
    "id": "cordova-plugin-insomnia.Insomnia",
    "file": "plugins/cordova-plugin-insomnia/www/Insomnia.js",
    "pluginId": "cordova-plugin-insomnia",
    "clobbers": [
      "window.plugins.insomnia"
    ]
  },
  {
    "id": "cordova-plugin-kiosk.kioskPlugin",
    "file": "plugins/cordova-plugin-kiosk/kiosk.js",
    "pluginId": "cordova-plugin-kiosk",
    "clobbers": [
      "window.KioskPlugin"
    ]
  }
];
module.exports.metadata = 
// TOP OF METADATA
{
  "cordova-plugin-insomnia": "4.3.0",
  "cordova-plugin-kiosk": "0.2",
  "cordova-plugin-remote-injection": "0.5.2",
  "cordova-plugin-whitelist": "1.3.3"
};
// BOTTOM OF METADATA
});