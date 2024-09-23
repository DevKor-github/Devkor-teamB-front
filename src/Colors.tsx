const PRIMARY = {
  50: 'rgb(255, 231, 243)',
  100: 'rgb(255, 182, 217)',
  200: 'rgb(255, 146, 199)',
  300: 'rgb(255, 97, 173)',
  400: 'rgb(255, 66, 157)',
  500: 'rgb(255, 19, 133)',
  600: 'rgb(232, 17, 121)',
  700: 'rgb(181, 13, 94)',
  800: 'rgb(140, 10, 73)',
  900: 'rgb(107, 8, 56)',
};

const Colors = {
  primary: PRIMARY,
  subject: {
    color1: 'rgb(255, 20, 133)',
    color2: 'rgb(235, 112, 129)',
    color3: 'rgb(121, 148, 249)',
    color4: 'rgb(240, 161, 117)',
    color5: 'rgb(236, 112, 226)',
    color6: 'rgb(137, 234, 146)',
    color7: 'rgb(149, 111, 248)',
  },
  ui: {
    primary: PRIMARY[400],
    secondary: PRIMARY[200],
    onPrimary: PRIMARY[50],
    disabled: 'rgb(230, 230, 230)',
    background: 'rgb(255, 255, 255)',
  },
  text: {
    accent: PRIMARY[500],
    white: 'rgb(255, 255, 255)',
    black: 'rgb(0, 0, 0)',
    gray: 'rgb(80, 80, 80)',
    lightgray: 'rgb(180, 180, 180)',
    red: 'rgb(255, 70, 70)',
  },
};

export default Colors;
