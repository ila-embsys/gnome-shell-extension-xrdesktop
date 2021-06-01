extension_sources = files('extension.js')
extension_data = files('metadata.json', 'stylesheet.css', 'vr-symbolic.svg')

install_data (extension_sources + extension_data,
  install_dir: join_paths(extensiondir, uuid)
)

if js52.found()
    js = js52
elif js60.found()
    js = js60
elif js68.found()
    js = js68
elif js78.found()
    js = js78
endif

foreach js_source : extension_sources
  if (js.found())
    path_array = '@0@'.format(js_source).split('/')
    name = join_paths(path_array[-2], path_array[-1])

    test('Checking syntax of ' + name, js,
      args: ['-s', '-c', js_source],
      workdir: meson.current_source_dir()
    )
  endif
endforeach
