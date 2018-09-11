
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

class VRControlIndicator extends PanelMenu.Button {
  constructor() {
    super(0.0, "VR Control");

    let icon = new St.Icon({ icon_name: 'preferences-desktop-display',
                             style_class: 'system-status-icon' });

    this.actor.add_actor(icon);

    this.menu_section = new PopupMenu.PopupMenuSection();
    this.menu.addMenuItem(this.menu_section);

    _vrswitch = new PopupMenu.PopupSwitchMenuItem("VR Mirror enabled");
    this.menu_section.addMenuItem(_vrswitch)

    this.menu.connect('open-state-changed', this._sync)

    _vrswitch.connect("toggled", function(object, value) {
      if(value) {
        global.log("++++++++++++++++++++ Enable VR mode ++++++++++++++++++++");
        _proxy.enabled = true;
      } else {
        global.log("++++++++++++++++++++ Disable VR mode +++++++++++++++++++");
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
  }

  _sync() {
    // TODO: This is always false when changed e.g. via shell script. Why?
    let enabled = _proxy.enabled;
    //global.log("Set XR switch to " + _proxy.enabled);
    _vrswitch.setToggleState(enabled);
  }
};


let indicator;

function enable() {
    indicator = new VRControlIndicator;
    Main.panel.addToStatusArea('vr-control-indicator', indicator);
}

function disable() {
    indicator.destroy();
}