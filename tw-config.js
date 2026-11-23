/* 누구랑 Tailwind 설정 (디자인 시안 DESIGN.md 토큰) — 서브 페이지 공통 */
if (window.tailwind) tailwind.config = {
  corePlugins: { container: false }, // style.css의 .container(헤더·푸터)와 충돌 방지
  theme: {
    extend: {
      colors: {
        "on-background": "#241913", "on-error": "#ffffff", "on-tertiary": "#ffffff",
        "surface-container-low": "#fff1ea", "inverse-primary": "#ffb5a0", "secondary-fixed-dim": "#ffb5a0",
        "on-primary-fixed": "#3b0900", "inverse-surface": "#3a2e26", "on-primary": "#ffffff",
        "surface-container-lowest": "#ffffff", "surface-container": "#ffeadf", "inverse-on-surface": "#ffede4",
        "secondary": "#9c4329", "error": "#ba1a1a", "surface-variant": "#f4ded3",
        "on-tertiary-fixed-variant": "#6e3724", "on-primary-fixed-variant": "#7d2c14", "on-primary-container": "#fff6f5",
        "outline": "#89726c", "surface-tint": "#9c4329", "surface-container-highest": "#f4ded3",
        "surface-dim": "#ebd6cb", "secondary-fixed": "#ffdbd1", "tertiary-fixed-dim": "#ffb59c",
        "on-surface": "#241913", "primary-container": "#b5563a", "primary": "#963f25", "tertiary": "#854934",
        "background": "#fff8f5", "outline-variant": "#dcc1b9", "surface-container-high": "#f9e4d9",
        "primary-fixed-dim": "#ffb5a0", "secondary-container": "#ff9070", "primary-fixed": "#ffdbd1",
        "error-container": "#ffdad6", "on-secondary-container": "#762710", "tertiary-fixed": "#ffdbcf",
        "on-tertiary-container": "#fff6f4", "surface": "#fff8f5", "on-secondary-fixed-variant": "#7d2d15",
        "on-surface-variant": "#56423d", "on-secondary": "#ffffff", "on-error-container": "#93000a",
        "on-secondary-fixed": "#3b0900", "tertiary-container": "#a2614a", "surface-bright": "#fff8f5",
        "on-tertiary-fixed": "#370e01"
      },
      borderRadius: { DEFAULT: "0.25rem", lg: "0.5rem", xl: "0.75rem", full: "9999px" },
      spacing: {
        "gutter-md": "1.5rem", "margin-md": "2rem", "space-xl": "2.5rem", "margin-lg": "3rem", "space-md": "1rem",
        "gutter": "1rem", "space-xs": "0.25rem", "margin": "1rem", "gutter-lg": "2rem", "space-lg": "1.5rem", "space-sm": "0.5rem"
      },
      fontFamily: Object.fromEntries(
        ["body-sm", "headline-lg-mobile", "headline-sm", "label-sm", "headline-xl", "body-md", "headline-xl-mobile",
         "headline-md", "headline-lg", "label-md", "label-lg", "body-lg"].map(k => [k, ["Noto Sans KR", "Noto Sans", "sans-serif"]])
      ),
      fontSize: {
        "body-sm": ["13px", { lineHeight: "18px", letterSpacing: "0em", fontWeight: "400" }],
        "headline-lg-mobile": ["22px", { lineHeight: "30px", letterSpacing: "-0.015em", fontWeight: "700" }],
        "headline-sm": ["17px", { lineHeight: "24px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "label-sm": ["11px", { lineHeight: "14px", letterSpacing: "0.02em", fontWeight: "600" }],
        "headline-xl": ["36px", { lineHeight: "48px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "body-md": ["14px", { lineHeight: "22px", letterSpacing: "-0.005em", fontWeight: "400" }],
        "headline-xl-mobile": ["28px", { lineHeight: "38px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-md": ["20px", { lineHeight: "28px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "headline-lg": ["28px", { lineHeight: "38px", letterSpacing: "-0.015em", fontWeight: "700" }],
        "label-md": ["12px", { lineHeight: "16px", letterSpacing: "0.01em", fontWeight: "600" }],
        "label-lg": ["14px", { lineHeight: "20px", letterSpacing: "0em", fontWeight: "600" }],
        "body-lg": ["16px", { lineHeight: "26px", letterSpacing: "-0.005em", fontWeight: "400" }]
      }
    }
  }
};
