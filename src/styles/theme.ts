import { extendTheme } from 'native-base';

export const THEME = extendTheme({
  colors: {
    gray: {
      950: '#09090A',
      900: '#121214',
      800: '#202024',
      600: '#323238',
      300: '#8D8D99',
      200: '#C4C4CC',
    },
    green: {
      500: '#047C3F'
    },
    yellow: {
      500: '#F7DD43',
      400: '#BBA317',
    },
    red: {
      500: '#DB4437',
    },
    purple: {
      500: '#7852bc',
      600: '#422d5e',
      800: '#1d1824',
    },
    white: '#FFFFFF'
  },
  fonts: {
    heading: 'Roboto_700Bold',
    body: 'Roboto_400Regular',
    medium: 'Roboto_500Medium'
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 25,
  },
  sizes: {
    14: 56,
    22: 87
  }
});