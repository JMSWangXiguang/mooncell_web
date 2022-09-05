/*
 * @Author: imali
 * @Date: 2022-02-19 17:52:06
 * @LastEditTime: 2022-02-19 17:54:02
 * @LastEditors: imali
 * @Description:
 */
import plugin from "windicss/plugin";

export default {
  mode: "jit",
  attributify: true,
  important: true,
  purge: ["./public/**/*.html", "./src/**/*.{js,jsx,ts,tsx,vue}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [
    require("windicss/plugin/scroll-snap"),
    require("@windicss/plugin-scrollbar"),
    require("windicss/plugin/line-clamp"),
    plugin(({ addUtilities }) => {
      addUtilities({
        ".text-decorator": {
          paddingLeft: "8px",
          display: "inline-block",
          height: "32px",
          lineHeight: "32px",
          "&:before": {
            content: "attr(none)",
            width: "4px",
            height: "16px",
            position: "absolute",
            top: "8px",
            left: "0",
            background: "#58c1ee",
          },
        },
      });
    }),
  ],
};
