import path from 'path'
import reactRefresh from '@vitejs/plugin-react-refresh'
import {defineConfig} from 'vite'

export default defineConfig({
  plugins: [reactRefresh()],
  resolve: {
    alias: [
      {
        find: '@sanity/base',
        replacement: path.resolve(__dirname, '../../../base/src'),
      },
      {
        find: '@sanity/form-builder',
        replacement: path.resolve(__dirname, '../../src'),
      },
      {
        find: '@sanity/portable-text-editor',
        replacement: path.resolve(
          __dirname,
          '../../../../node_modules/@sanity/portable-text-editor/src'
        ),
      },
      {
        find: '@sanity/schema/lib',
        replacement: path.resolve(__dirname, '../../../schema/src'),
      },
      {
        find: '@sanity/schema',
        replacement: path.resolve(__dirname, '../../../schema/src/legacy'),
      },
      {
        find: '@sanity/types',
        replacement: path.resolve(__dirname, '../../../types/src'),
      },
      {
        find: '@sanity/util/paths',
        replacement: path.resolve(__dirname, '../../../util/src/pathUtils'),
      },
      {
        find: '@sanity/validation',
        replacement: path.resolve(__dirname, '../../../validation/src'),
      },

      // Parts
      {
        find: 'part:@sanity/base/authentication-fetcher',
        replacement: path.resolve(__dirname, '../mocks/authentication-fetcher.ts'),
      },
      {
        find: 'part:@sanity/base/client',
        replacement: path.resolve(__dirname, '../mocks/client.ts'),
      },
      {
        find: 'part:@sanity/base/router',
        replacement: path.resolve(__dirname, '../../../base/src/router'),
      },
      {
        find: 'part:@sanity/base/schema',
        replacement: path.resolve(__dirname, '../../../base/src/schema'),
      },
      {
        find: 'part:@sanity/base/user',
        replacement: path.resolve(__dirname, '../mocks/user-store.ts'),
      },
      {
        find: /^part:.*/,
        replacement: path.resolve(__dirname, '../mocks/parts.ts'),
      },
      {
        find: /^all:part:.*/,
        replacement: path.resolve(__dirname, '../mocks/parts.ts'),
      },
      {
        find: /.*\.css$/,
        replacement: path.resolve(__dirname, '../mocks/css.ts'),
      },
      {
        find: 'config:@sanity/form-builder',
        replacement: path.resolve(__dirname, '../mocks/empty.ts'),
      },
      {
        find: 'sanity:css-custom-properties',
        replacement: path.resolve(__dirname, '../mocks/empty.ts'),
      },
    ],
  },
})
