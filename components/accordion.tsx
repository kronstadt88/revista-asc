import React, {useEffect, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  
  Pressable
} from 'react-native';
import { Link } from "expo-router";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { FontAwesome } from "@expo/vector-icons";
import { Button } from 'react-native-paper';
import { getValueFor } from '../services/secureStore';


const data = [
  {
    id: 0,
    code: "forex",
    title: 'Forex',
    description:["Eur/Usd", "Usd/Jpy"]
      
  },
  {
    id: 1,
    code: "index",
    title: 'Index',
    description:["Dax", "Sp500"]
  },
  {
    id: 3,
    code: "bonds",
    title: 'Bonds',
    description:["Eur/Bnd", "UST"]
  },
  {
    id: 4,
    code: "commodities",
    title: 'Commodities',
    description:["Gold", "Silver"]
  },
  {
    id: 5,
    code: "crypto",
    title: 'Cryptocurrencies',
    description:["Btc/Usd"]
  },
  {
    id: 6,
    code: "shares",
    title: 'Shares',
    description:["Santander", "Bbva"]
  },
  {
    id: 7,
    code: "actualidad",
    title: 'Actualidad',
    description:["Actualidad"]
  }
];

const AnimatedAcordion = () => (
  <View style={styles.containerStyle}>
    <FlatList
      data={data}
      keyExtractor={item => item.id.toString()}
      renderItem={({item}) => (
        <AccordionItem title={item.title} code={item.code} description={item.description} />
      )}
    />
    
  </View>
);

const AccordionItem = ({title, code, description}) => {
  const shareValue = useSharedValue(0);
  const [bodySectionHeight, setBodySectionHeight] = useState(0);
  const [subscribed, setSubscribed] = useState("")
  
  const getSubscription = async () =>{
    let subscription: any = await getValueFor("sub");
    console.log("getSub")
    console.log(subscription)
    setSubscribed(subscription)
  }

  const bodyHeight = useAnimatedStyle(() => ({
    height: interpolate(shareValue.value, [0, 1], [0, bodySectionHeight])
  }));

  const iconStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${interpolate(shareValue.value, [0, 1], [0, 180])}deg`,
        },
      ],
    };
  });

  useEffect(()=>{
    getSubscription();
  }, [])

  const toggleButton = () => {

    if (shareValue.value === 0) {
      shareValue.value = withTiming(1, {
        duration: 500,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
      });
    } else {
      shareValue.value = withTiming(0, {
        duration: 500,
        easing:Easing.bezier(0.4, 0.0, 0.2, 1),
      });
    }
  };

  return (
    <View style={styles.subContainer}>
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.btnStyle}
        >
        <Text style={styles.title}>{title} </Text>
          <Animated.View style={iconStyle}>
            {subscribed.includes(code) &&
              <FontAwesome name="chevron-down" size={24} color="black" onPress={toggleButton}/>
            }
            {!subscribed.includes(code) &&
            <Link href="/(auth)/checkout">
              <FontAwesome name="shopping-cart" size={30} color="black" />
            </Link>
              
            }
          
          </Animated.View>
      </TouchableOpacity>

        <Animated.View
          style={[styles.descStyle, bodyHeight]}>
          <View
            style={styles.bodyContainer}
            onLayout={event => {
              setBodySectionHeight(event.nativeEvent.layout.height);
            }}>
                 {description.map((item, index) => {
                    return (
                        <View style={styles.articlesContainer} key={index}>
                          <Link href={`/article/${item.toLowerCase().replace("/", "")}`} >
                            
                              <Text>{item}</Text>
                            
                          </Link>
                            
                              
                            
                            
                        </View>
                        );
                    })
                }
            
          </View>
        </Animated.View>

    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 24,
  },
  btnStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  subContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 8,
    marginBottom: 6,
    flex: 1,
    borderRadius: 10,
  },
  
  descStyle: {
    overflow: 'hidden',
  },
  title: {
    fontSize:18,
    fontWeight: '600',
  },
  description: {
    fontSize:14,
    fontWeight: '600',
  },
  articlesContainer:{
    margin: 20
  },
  bodyContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    paddingBottom: 20
  },
});

export default AnimatedAcordion;