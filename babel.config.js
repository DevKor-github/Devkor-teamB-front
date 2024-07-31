module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          tests: ['./tests/'],
          '@src': './src',
          '@assets': './src/assets',
          '@components': './src/components',
          '@navigator': './src/navigator',
          '@screens': './src/screens',
        },
      },
    ],
    ['@babel/plugin-transform-private-methods', { "loose": true }]
  ],
};
