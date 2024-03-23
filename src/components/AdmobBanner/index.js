import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';



import React, { useEffect } from "react";
import { admobConfig } from "../../utills/adMobConfig";
const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : admobConfig.admobBannerId.android;


const AdmobBanner = (props) => {

  return (
    <BannerAd
      unitId={adUnitId}
      size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      onAdOpened={e => {
        console.log("onAdOpened");
        console.log(e);
      }}
      onAdFailedToLoad={e => {
        console.log("onAdFailedToLoad");
        console.log(e);
      }}
      onAdLoaded={e => {
        console.log("onAdLoaded");
        console.log(e);
      }}
      onAdClosed={e => {
        console.log("onAdClosed");
        console.log(e);
      }}
    />
  );
};

export default AdmobBanner;
