// BatteryHealthGraph.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';


const BatteryHealthGraph = ({ data }) => {
    const screenWidth = Dimensions.get('window').width;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Battery Health</Text>
      <LineChart
        data={{
          labels: data.labels, // Time labels (e.g., ["06:00", "09:00", "10:00", "11:00"])
          datasets: [
            {
              data: data.voltages, // Battery voltage data (e.g., [3.00, 3.80, 3.75, 3.70])
            },
          ],
        }}
        width={screenWidth - 70} // Make it responsive
        height={350} // Height of the chart
        yAxisLabel="V"
        yAxisSuffix=""
        yAxisInterval={1}
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#F5F5F5',
          backgroundGradientTo: '#E0F8DF',
          decimalPlaces: 2, // Number of decimal places for voltage values
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Line color
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Label color
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '2', // Dot radius
            strokeWidth: '2',
            stroke: '#ffa726', // Dot border color
          },
        }}
        bezier // Smooth line
        style={styles.chart}
        withHorizontalLabels={true} // Keep Y-axis labels
        withVerticalLabels={false} // Hide default X-axis labels
      />



{/* Custom Rotated X-Axis Labels */}
<View style={styles.xAxisContainer}>
        {data.labels.map((label, index) => (
          <Text key={index} style={styles.rotatedLabel}>
            {label}
          </Text>
        ))}
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  chart: {
    borderRadius: 12,
  },
  xAxisContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%', 
    marginTop: 10,
  },
  rotatedLabel: {
    transform: [{ rotate: '90deg' }], // Rotate text 90 degrees
    fontSize: 12,
    textAlign: 'center',
    marginHorizontal: 5,
  },
});

export default BatteryHealthGraph;