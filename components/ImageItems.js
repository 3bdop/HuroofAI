import React, { useEffect } from 'react';
import { View, Dimensions, StyleSheet, Image } from 'react-native';
import Carousel from 'react-native-snap-carousel';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function ImageItems({ data }) {
  useEffect(() => {
    console.log('ImageItems received data:', data);
  }, [data]);

  if (!data || data.length === 0) {
    console.log('No data received');
    return null;
  }

  const renderItem = ({ item, index }) => {
    console.log('Rendering item:', index, item);
    return (
      <View style={styles.card}>
        <Image
          source={item.image}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Carousel
        data={data}
        renderItem={renderItem}
        sliderWidth={SCREEN_WIDTH}
        itemWidth={SCREEN_WIDTH * 0.8}
        inactiveSlideOpacity={0.6}
        loop={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 10,
  },
  image: {
    width: '100%',
    height: '80%',
  },
  cardText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  }
});
