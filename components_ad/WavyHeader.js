import React from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';



export default function WavyHeader({ customStyles }) {
    return (
      <View style={customStyles}>
        <View style={{ backgroundColor: '#81a010', height: 40 ,paddingHorizontal: 120,top: -15}}>
        

          <Svg
          height={130}  // Use a number instead of a string with units
          width={441}
          viewBox="0 0 1440 320"
          style={{ position: 'absolute', top: 20 }}
        >
          <Path
            fill="#81a010"
            fillOpacity="1"
            d="M0,224L60,213.3C120,203,240,181,360,192C480,203,600,245,720,234.7C840,224,960,160,1080,128C1200,96,1320,96,1380,96L1440,96L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
          />
        </Svg>
        </View>
      </View>
    );
  }