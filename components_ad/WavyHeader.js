import React from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';



export default function WavyHeader({ customStyles }) {
    return (
      <View style={customStyles}>
        <View style={{ backgroundColor: '#417722', height: 90 ,paddingHorizontal: 120}}>
        

          <Svg
          height={200}  // Use a number instead of a string with units
          width={440}
          viewBox="0 0 1440 320"
          style={{ position: 'absolute', top: 20 }}
        >
          <Path
            fill="#417722"
            fillOpacity="1"
            d="M0,64L26.7,85.3C53.3,107,107,149,160,181.3C213.3,213,267,235,320,240C373.3,245,427,235,480,197.3C533.3,160,587,96,640,101.3C693.3,107,747,181,800,181.3C853.3,181,907,107,960,96C1013.3,85,1067,139,1120,176C1173.3,213,1227,235,1280,213.3C1333.3,192,1387,128,1413,96L1440,64L1440,0L1413.3,0C1386.7,0,1333,0,1280,0C1226.7,0,1173,0,1120,0C1066.7,0,1013,0,960,0C906.7,0,853,0,800,0C746.7,0,693,0,640,0C586.7,0,533,0,480,0C426.7,0,373,0,320,0C266.7,0,213,0,160,0C106.7,0,53,0,27,0L0,0Z"
          />
        </Svg>
        </View>
      </View>
    );
  }