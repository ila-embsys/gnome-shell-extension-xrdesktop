# GNOME Shell Extension vrdesktop

An extension for toggling XR Desktop mode in GNOME Shell.

## Manual installation

Copy to `xrdesktop-extension@collabora.com` to `~/.local/share/gnome-shell/extensions`

## Meson

```
meson build
ninja -C build
meson install -C build
```

### Run tests / Validate JS

```
meson test -C build
```

## License

MIT
