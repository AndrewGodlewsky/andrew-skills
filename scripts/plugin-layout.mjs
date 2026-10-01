// Repository layouts are publication properties; installed plugins still use skills/.
export const layouts = [
  { source: './', manifest: 'plugin.json', skills: 'skills' },
  { source: './plugins/gt', manifest: 'plugins/gt/plugin.json', skills: 'plugins/gt/skills' },
];

export function resolvePluginLayout(files) {
  const file = files.get('.claude-plugin/marketplace.json');
  if (!file || !['100644', '100755'].includes(file.mode)) throw new Error('Missing or unsupported marketplace manifest');
  const marketplace = JSON.parse(new TextDecoder('utf8', { fatal: true }).decode(file.data));
  const layout = marketplace.plugins?.length === 1 && layouts.find(item => item.source === marketplace.plugins[0]?.source);
  if (!layout) throw new Error('Marketplace source must select ./ or ./plugins/gt');
  const manifest = files.get(layout.manifest);
  if (!manifest || !['100644', '100755'].includes(manifest.mode)) throw new Error(`Missing or unsupported ${layout.manifest}`);
  for (const other of layouts.filter(item => item !== layout)) {
    if ([...files.keys()].some(path => path === other.manifest || path === other.skills || path.startsWith(`${other.skills}/`))) {
      throw new Error('Ambiguous plugin layout: inactive manifest or skill collection is present');
    }
  }
  if (files.has(layout.skills)) throw new Error(`${layout.skills} must be a directory`);
  return layout;
}

export function isSkillSourcePath(path, name) {
  return layouts.some(layout => path === `${layout.skills}/${name}`);
}
