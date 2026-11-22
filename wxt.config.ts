import { defineConfig } from 'wxt';
import svgr from 'vite-plugin-svgr';

// See https://wxt.dev/api/reference/wxt/interfaces/inlineconfig.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  srcDir: 'src',
  vite: () => ({
    plugins: [
      svgr({
        svgrOptions: {
          icon: true, // width/height become 1em
          replaceAttrValues: { '#000': 'currentColor' }, // optional: make icons recolorable
          svgoConfig: {
            plugins: [
              { name: 'preset-default', params: { overrides: { removeViewBox: false } } },
            ],
          },
        },
      }),
    ]
  })
});
