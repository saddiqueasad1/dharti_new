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
  myads:{
    color:AppColors.black,
    fontWeight:'bold',
    fontSize:height(2.5),

  },
  myadsView:{
    padding:height(2),
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'white'
  }
});
export default styles;
