project('gnome-shell-extension-xrdesktop',
  version: '0.8.0',
  meson_version: '>= 0.44.0',
  license: 'MIT'
)

datadir = get_option('datadir')
shelldir = join_paths(datadir, 'gnome-shell')
extensiondir = join_paths(shelldir, 'extensions')
js52 = find_program('js52', required: false)

uuid = 'gnomevr-extension@collabora.com'

subdir(uuid)
