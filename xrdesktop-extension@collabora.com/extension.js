/*
 * xrdesktop Extension
 * Copyright 2018 Collabora Ltd.
 * Author: Christoph Haag <christoph.haag@collabora.com>
 * Author: Lubosz Sarnecki <lubosz.sarnecki@collabora.com>
 * SPDX-License-Identifier: MIT
 */

import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';

import St from 'gi://St';
import GObject from 'gi://GObject';
import Gio from 'gi://Gio';

import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';
import * as Util from 'resource:///org/gnome/shell/misc/util.js';

const XRControlInterface =
'<node>\
  <interface name="org.gnome.Shell.XR">\
    <property name="enabled" type="b" access="readwrite" />\
  </interface>\
</node>';

// Declare the proxy class based on the interface
const XRControlProxy = Gio.DBusProxy.makeProxyWrapper(XRControlInterface);

let XRControlIndicator = GObject.registerClass(
  class XRControlIndicator extends PanelMenu.Button {
    
    constructor() {
      super(0.0, "xrdesktop Control");

      let proxy = new XRControlProxy(
        Gio.DBus.session,
        "org.gnome.Shell.XR",
        "/org/gnome/Shell/XR",
        (_proxy, error) => {
            if (error) {
                // log(error.message);
                return;
            }
        });

      this.add_child(new St.Icon({ style_class: 'gnome-vr-icon' }));

      this.menu_section = new PopupMenu.PopupMenuSection();
      this.menu.addMenuItem(this.menu_section);

      let sw = new PopupMenu.PopupSwitchMenuItem("Mirror to XR", false);
      this.menu_section.addMenuItem(sw);

      this.menu.connect('open-state-changed', () => {
        sw.setToggleState(proxy.enabled);
      });

      sw.connect("toggled", (_item, state) => {
        if(state) {
          proxy.enabled = true;
        } else {
          proxy.enabled = false;
        }
      });

      let settings_item = new PopupMenu.PopupMenuItem("Settings");
      settings_item.connect('activate', () => {
          Util.spawn(["xrd-settings"]);
      });

      this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
      this.menu.addMenuItem(settings_item);
    }
  });


export default class XrDesktopExtension extends Extension {

  constructor(metadata) {
    super(metadata);

    console.debug(`constructing ${this.metadata.name}`);
  }

  enable() {
    this._indicator = new XRControlIndicator();
    Main.panel.addToStatusArea('xrdesktop-control-indicator', this._indicator);
  }

  disable() {
    this._indicator?.destroy();
    this._indicator = null;
  }

}