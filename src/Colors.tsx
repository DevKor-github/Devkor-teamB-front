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
    color1: PRIMARY[600],
    color2: PRIMARY[500],
    color3: PRIMARY[400],
    color4: PRIMARY[300],
    color5: PRIMARY[200],
    color6: PRIMARY[100],
  },
  ui: {
    primary: PRIMARY[400],
    secondary: PRIMARY[200],
    onPrimary: PRIMARY[50],
    disabled: 'rgb(230, 230, 230)',
    background: 'rgb(255, 255, 255)',
    gray: 'rgb(200, 200, 200)',
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

export const setOpacity = (color: string, opacity: number) => {
  return color.replace('rgb', 'rgba').replace(')', `, ${opacity})`);
};

export default Colors;
