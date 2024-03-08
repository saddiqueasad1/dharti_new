import React, { useState } from "react";
import { View, StyleSheet, Text, Modal, TouchableOpacity } from "react-native";

// External Libraries
// import DateTimePicker from "@react-native-community/datetimepicker";

// Custom Components & Constants
import AppColors from "../../utills/AppColors";
import { useTranslation } from "react-i18next";



const BHTimePicker = ({ day, type, onSelectTime, value, is12Hour, serial }) => {
  const ios = false
  const rtl_support = false
  const [time, setTime] = useState(new Date());
  const { t } = useTranslation();

  const [show, setShow] = useState(false);
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
  const onChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    if (ios) {
      setTime(currentTime);
    } else {
      if (event.type === "set") {
        setShow(ios);
        setTime(currentTime);
        onSelectTime(day, type, currentTime, serial);
      } else {
        setShow(ios);
      }
    }
  };

  const showTimepicker = () => {
    setShow(true);
  };
  return ios ? (
    <View
      style={[
        styles.container,
        { alignItems: rtl_support ? "flex-end" : "flex-start" },
      ]}
    >
      <Text
        style={[{ color: AppColors.text_gray }, rtlTextA]}
        onPress={showTimepicker}
      >
        {value}
      </Text>

      <Modal animationType="slide" transparent={true} visible={show}>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <View
            style={{
              width: "50%",
              alignItems: "center",
              backgroundColor: AppColors.bg_light,
              paddingVertical: 30,
            }}
          >
            <View
              style={{
                width: "50%",
                alignItems: "stretch",
              }}
            >
              {/* <DateTimePicker
                testID="dateTimePicker"
                value={time}
                mode="time"
                display={ios ? "compact" : "default"}
                onChange={onChange}
                is24Hour={!is12Hour}
              /> */}
            </View>
            <TouchableOpacity
              style={{
                paddingHorizontal: 20,
                marginTop: 20,
                paddingVertical: 5,
                backgroundColor: AppColors.primary,
                borderRadius: 10,
              }}
              onPress={() => {
                setShow(false);
                onSelectTime(day, type, time, serial);
              }}
            >
              <Text style={{ color: AppColors.white }}>
                {t("OHTimePickerTexts.okButtonTitle")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  ) : (
    <View style={styles.container}>
      <Text style={styles.text} onPress={showTimepicker}>
        {value}
      </Text>
      {/* {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={time}
          mode="time"
          display={ios ? "compact" : "default"}
          onChange={onChange}
          is24Hour={!is12Hour}
        />
      )} */}
    </View>
  );
};



export default BHTimePicker;
