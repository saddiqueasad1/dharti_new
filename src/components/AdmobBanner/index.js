import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';



import React, { useEffect } from "react";
import { admobConfig } from "../../utills/adMobConfig";
const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : admobConfig.admobBannerId.android;


const AdmobBanner = (props) => {

  return (
    <BannerAd
      unitId={adUnitId}
      size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
    />
  );
};

export default AdmobBanner;
