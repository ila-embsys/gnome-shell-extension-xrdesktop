/*
 * GNOME VR Extension
 * Copyright 2018 Collabora Ltd.
 * Author: Christoph Haag <christoph.haag@collabora.com>
 * Author: Lubosz Sarnecki <lubosz.sarnecki@collabora.com>
 * SPDX-License-Identifier: MIT
 */

const St = imports.gi.St;
const Main = imports.ui.main;
const Tweener = imports.ui.tweener;

const Clutter = imports.gi.Clutter;
const GLib = imports.gi.GLib;

const GnomeDesktop = imports.gi.GnomeDesktop;
const Gdk = imports.gi.Gdk;

const Gio = imports.gi.Gio;

const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const Util = imports.misc.util;


const VRControlInterface =
'<node>\
  <interface name="org.gnome.Shell.XR">\
    <property name="enabled" type="b" access="readwrite" />\
  </interface>\
</node>';

// Declare the proxy class based on the interface
const VRControlProxy = Gio.DBusProxy.makeProxyWrapper(VRControlInterface);

let _proxy;
let _vrswitch;

function init() {
}

function _sync() {
  _vrswitch.setToggleState(_proxy.enabled);
}

class VRControlIndicator extends PanelMenu.Button {
  constructor() {
    super(0.0, "xrdesktop Control");

    let icon = new St.Icon({style_class: 'gnome-vr-icon'});

    this.actor.add_actor(icon);

    this.menu_section = new PopupMenu.PopupMenuSection();
    this.menu.addMenuItem(this.menu_section);

    _vrswitch = new PopupMenu.PopupSwitchMenuItem("Mirror to XR");
    this.menu_section.addMenuItem(_vrswitch);

    this.menu.connect('open-state-changed', _sync);

    _vrswitch.connect("toggled", function(object, value) {
      if(value) {
        _proxy.enabled = true;
      } else {
        _proxy.enabled = false;
      }
    });

    _proxy = new VRControlProxy(
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
};


let indicator;

function enable() {
    indicator = new VRControlIndicator;
    Main.panel.addToStatusArea('xrdesktop-control-indicator', indicator);
}

function disable() {
    indicator.destroy();
}
