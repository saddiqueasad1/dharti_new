import { StyleSheet } from 'react-native';
import { height, width } from '../../../utills/Dimension';
import AppColors from '../../../utills/AppColors';

const styles = StyleSheet.create({
  mainViewContainer: {
    alignItems: 'center',
    padding:width(4),
    backgroundColor:AppColors.white
  },
  title: {
    color: AppColors.black,
    fontWeight: 'bold',
    fontSize: width(4),
    marginBottom: height(2)
  },
  searchinput:{
    width:width(90),
    alignSelf:'center',
    borderWidth:1,
    borderRadius:width(1),
    padding:width(2)
  },
  titleview:{
    justifyContent:'space-between',
    padding:width(1),
    flexDirection:'row',
    width:width(90)
  },
  iconButton: {
    borderRadius: 3,
    backgroundColor: AppColors.primary,
    width: 25,
    height: 25,
    position: 'absolute',
    bottom: 10,
    right: 20,
    justifyContent:"center",
    alignItems:"center"
  },
  dltIconWrap: {
    width: 15,
    height: 15,
  },
});
export default styles;
