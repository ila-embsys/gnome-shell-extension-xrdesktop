/*
 * xrdesktop Extension
 * Copyright 2018 Collabora Ltd.
 * Author: Christoph Haag <christoph.haag@collabora.com>
 * Author: Lubosz Sarnecki <lubosz.sarnecki@collabora.com>
 * SPDX-License-Identifier: MIT
 */

const { St, GObject, Gio } = imports.gi;

const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const Util = imports.misc.util;

const XRControlInterface =
'<node>\
  <interface name="org.gnome.Shell.XR">\
    <property name="enabled" type="b" access="readwrite" />\
  </interface>\
</node>';

// Declare the proxy class based on the interface
const XRControlProxy = Gio.DBusProxy.makeProxyWrapper(XRControlInterface);

let _proxy;
let _switch;

function init() {
}

function _sync() {
  _switch.setToggleState(_proxy.enabled);
}

var XRControlIndicator = GObject.registerClass(
class XRControlIndicator extends PanelMenu.Button {
  _init() {
    super._init(0.0, "xrdesktop Control");

    this.add_child(new St.Icon({ style_class: 'gnome-vr-icon' }));

    this.menu_section = new PopupMenu.PopupMenuSection();
    this.menu.addMenuItem(this.menu_section);

    _switch = new PopupMenu.PopupSwitchMenuItem("Mirror to XR", false);
    this.menu_section.addMenuItem(_switch);

    this.menu.connect('open-state-changed', _sync);

    _switch.connect("toggled", function(object, value) {
      if(value) {
        _proxy.enabled = true;
      } else {
        _proxy.enabled = false;
      }
    });

    _proxy = new XRControlProxy(
      Gio.DBus.session,
      "org.gnome.Shell.XR",
      "/org/gnome/Shell/XR",
      (proxy, error) => {
          if (error) {
              log(error.message);
              return;
          }
      });

    let settings_item = new PopupMenu.PopupMenuItem("Settings");
    settings_item.connect('activate', function() {
        Util.spawn(["xrd-settings"]);
    });

    this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
    this.menu.addMenuItem(settings_item);
  }
});


let indicator;

function enable() {
    indicator = new XRControlIndicator;
    Main.panel.addToStatusArea('xrdesktop-control-indicator', indicator);
}

function disable() {
    indicator.destroy();
}
