import { StyleSheet } from 'react-native';
import { height, width } from '../../../utills/Dimension';
import AppColors from '../../../utills/AppColors';

const styles = StyleSheet.create({
  mainViewContainer: {
    alignItems: 'center',
    padding:width(4),
    paddingBottom:width(15),
    backgroundColor:AppColors.white
  },
  
});
export default styles;
