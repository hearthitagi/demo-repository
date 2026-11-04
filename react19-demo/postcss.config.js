export default {
  plugins: {
    'postcss-preset-env': {
      stage: 2,
      features: {
        'oklab-function': true, // 确保处理 oklch 颜色
      }
    },
  }
}