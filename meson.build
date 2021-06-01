project('gnome-shell-extension-xrdesktop',
  version: '0.14.0',
  meson_version: '>= 0.44.0',
  license: 'MIT'
)

datadir = get_option('datadir')
shelldir = join_paths(datadir, 'gnome-shell')
extensiondir = join_paths(shelldir, 'extensions')

js52 = find_program('js52', required: false)
js60 = find_program('js60', required: false)
js68 = find_program('js68', required: false)
js78 = find_program('js78', required: false)

uuid = 'xrdesktop-extension@collabora.com'

subdir(uuid)
