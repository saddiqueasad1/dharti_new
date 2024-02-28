import { StyleSheet} from 'react-native';
import AppColors from '../../utills/AppColors';

const styles = StyleSheet.create({
  button: {
    display: "flex",
    borderRadius: 3,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    padding: 10,
    backgroundColor: AppColors.button.active,
  },
  buttonDisabled: {
    display: "flex",
    borderRadius: 3,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    width: "100%",
    backgroundColor: AppColors.button.disabled,
  },
  loading: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.8,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 5,
    flex: 1,
    height: 23,
  },
  text: {
    fontSize: 16,
    color: AppColors.white,
    fontWeight: "bold",
  },
});
export default styles;
