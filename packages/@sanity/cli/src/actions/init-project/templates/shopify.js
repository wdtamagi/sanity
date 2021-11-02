export const dependencies = {
  'lodash.get': '^4.4.2',
  pluralize: '^8.0.0',
  'sanity-plugin-color-picker': '^1.0.3',
  '@sanity/color-input': '^2.21.7',
  slug: '^5.1.0',
  'sanity-plugin-media': '^1.4.0',
  'sanity-plugin-dashboard-widget-document-list': '^0.0.13',
}

export const generateSanityManifest = (base) => ({
  ...base,
  plugins: base.plugins.concat([
    '@sanity/color-input',
    'media',
    'dashboard-widget-document-list',
    'sanity-shopify-intro',
  ]),
})
