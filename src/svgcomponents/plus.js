import * as React from "react";
import Svg, { G, Circle, Path, Defs } from "react-native-svg";
/* SVGR has dropped some elements not supported by react-native-svg: filter */

function AddIcon(props) {
  return (
    <Svg
      width={59}
      height={59}
      viewBox="0 0 59 59"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <G filter="url(#filter0_d_983_2030)">
        <Circle cx={29.5} cy={25.5} r={25.5} fill="red" />
      </G>
      <G filter="url(#filter1_d_983_2030)">
        <Path
          d="M29.5 12.75a1.594 1.594 0 011.594 1.594v9.562h9.562a1.594 1.594 0 010 3.188h-9.562v9.562a1.594 1.594 0 01-3.188 0v-9.562h-9.562a1.594 1.594 0 010-3.188h9.562v-9.562A1.594 1.594 0 0129.5 12.75z"
          fill="#fff"
        />
      </G>
      <Defs></Defs>
    </Svg>
  );
}

export default AddIcon;
