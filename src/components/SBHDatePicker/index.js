import React, { useState } from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";

// External Libraries
// import DateTimePicker from "@react-native-community/datetimepicker";

// Custom Components & Constants
import AppColors from "../../utills/AppColors";
import { useTranslation } from "react-i18next";


const SBHDatePicker = ({ day, onSelectDate, value }) => {
  const [date, setDate] = useState(new Date());
  const rtl_support = false
  const ios = false
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

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    if (ios) {
      setDate(currentDate);
    } else {
      if (event.type === "set") {
        setShow(ios);
        setDate(currentDate);
        onSelectDate(day, currentDate);
      } else {
        setShow(ios);
      }
    }
  };

  const showDatepicker = () => {
    setShow(true);
  };
  return ios ? (
    <View style={styles.container}>
      <Text
        style={[{ color: AppColors.text_gray }, rtlTextA]}
        onPress={showDatepicker}
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
              }}
            >
              {/* <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode="date"
                display={ios ? "compact" : "default"}
                onChange={onChange}
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
                onSelectDate(day, date);
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
      <Text style={styles.text} onPress={showDatepicker}>
        {value}
      </Text>
      {/* {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date"
          display={ios ? "compact" : "default"}
          onChange={onChange}
        />
      )} */}
    </View>
  );
};



export default SBHDatePicker;
