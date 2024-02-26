import {Platform, StyleSheet} from 'react-native';
import AppColors from '../../utills/AppColors';
import { height, width } from '../../utills/Dimension';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: width(25),
    backgroundColor: AppColors.primary,
    width: width(85),
    alignSelf: 'center',
    paddingVertical: height(1.8),
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0, 0, 0, 0.2)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  text: {
    color: AppColors.white,
    fontSize: height(1.8),
    fontWeight: 'bold',
  },
});
export default styles;
