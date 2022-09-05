/*
 * @Author: imali
 * @Date: 2022-03-25 11:01:32
 * @LastEditTime: 2022-06-08 13:37:11
 * @LastEditors: imali
 * @Description:
 */
import { defineConfig } from 'vite-plugin-windicss'
import plugin from 'windicss/plugin'
import colors from './public/theme.json'

export default defineConfig({
  mode: 'jit',
  attributify: true,
  important: true,
  purge: ['./**/*.html', './src/**/*.{js,jsx,ts,tsx,vue}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: { colors },
  },
  variants: {},
  plugins: [
    require('windicss/plugin/scroll-snap'),
    require('@windicss/plugin-scrollbar'),
    require('windicss/plugin/line-clamp'),
    plugin(({ addUtilities }) => {
      addUtilities({
        '.text-decorator': {
          paddingLeft: '8px',
          display: 'inline-block',
          height: '32px',
          lineHeight: '32px',
          '&:before': {
            content: 'attr(none)',
            width: '4px',
            height: '16px',
            position: 'absolute',
            top: '8px',
            left: '0',
            background: '#58c1ee',
          },
        },
      })
    }),
  ],
})
