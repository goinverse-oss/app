/**
 * Some styles common to the app.
 *
 * NOTE (brettdh): this is an area where I'm less confident,
 * so I'd appreciate any and all suggestions on how to best
 * organize our styles.
 */
import { StyleSheet, Platform } from 'react-native';

export const defaultShadowStyle = (
  Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 6,
    },
    android: {
      elevation: 3,
    },
  })
);

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
