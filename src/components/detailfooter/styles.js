import {Platform, StyleSheet} from 'react-native';
import AppColors from '../../utills/AppColors';
import { height, width } from '../../utills/Dimension';

const styles = StyleSheet.create({
  container: {
    backgroundColor:AppColors.white,
    width: width(100),
    flexDirection:'row',
    justifyContent:'space-around',
    paddingBottom:height(3),
    alignItems:'center',
    paddingVertical:width(2),
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
  menuicon: {
    paddingLeft:width(5),
  },
});
export default styles;
