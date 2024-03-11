import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ScrollView,
} from "react-native";

// Vector Icons
import { FontAwesome5 } from "@expo/vector-icons";

// Custom Components
import AppColors from "../../utills/AppColors";
import { decodeString } from "../../utills/helper";
import styles from "./styles";
import { useTranslation } from "react-i18next";

const DynamicListPicker = ({ onselect, selected, field, handleTouch }) => {
  const rtl_support =  false
  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerText, setPickerText] = useState(selected);
  const { t } = useTranslation();

  const rtlText = rtl_support && {
    writingDirection: "rtl",
  };
  const rtlTextA = rtl_support && {
    writingDirection: "rtl",
    textAlign: "right",
  };
  const rtlView = rtl_support && {
    flexDirection: "row-reverse",
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.pickerFieldWrap, rtlView]}
        onPress={() => {
          handleTouch();
          setPickerVisible(!pickerVisible);
        }}
      >
        <Text style={[styles.priceTypePickerFieldText, rtlText]}>
          {pickerText
            ? pickerText
            : field.placeholder
            ? field.placeholder
            : `${t("dynamicListPickerTexts.selectText")} ${
                field.label
              }`}
        </Text>
        <FontAwesome5 name="chevron-down" size={14} color={AppColors.text_gray} />
      </TouchableOpacity>
      <Modal animationType="slide" transparent={true} visible={pickerVisible}>
        <TouchableWithoutFeedback onPress={() => setPickerVisible(false)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text
              style={[styles.modalText, rtlText]}
            >{`== ${field.label} ==`}</Text>
            <ScrollView
              contentContainerStyle={{
                display: "flex",
                width: "100%",
                alignItems: "flex-start",
              }}
            >
              {field.options.choices.map((item) => (
                <TouchableOpacity
                  style={[styles.pickerOptions, rtlView]}
                  key={`${item.id}`}
                  onPress={() => {
                    onselect(item);
                    setPickerText(item.name);
                    setPickerVisible(false);
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[styles.pickerOptionsText, rtlTextA]}
                      numberOfLines={1}
                    >
                      {decodeString(item.name)}
                    </Text>
                  </View>
                  {pickerText &&
                    (pickerText === item.name || pickerText === item.id) && (
                      <FontAwesome5 name="check" size={14} color="black" />
                    )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};


export default DynamicListPicker;
