project('gnome-shell-extension-xrdesktop',
  version: '0.16.0',
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

has_js = false

if js52.found()
    js = js52
    has_js = true
elif js60.found()
    js = js60
    has_js = true
elif js68.found()
    js = js68
    has_js = true
elif js78.found()
    js = js78
    has_js = true
endif

uuid = 'xrdesktop-extension@collabora.com'

subdir(uuid)
