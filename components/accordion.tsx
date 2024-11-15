import React, {useCallback, useEffect, useState} from 'react';
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
import { getSubscription } from '../services';
import { ActivityIndicator } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';


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

const AnimatedAcordion = () => {

  const [loading, setLoading] = useState(false);
  const [userSub, setUserSub] = useState<any>([])

  const getUserSubscription = async () =>{

    
    setLoading(true);
    let userSubscription: any = await getSubscription();
    setLoading(false);
    setUserSub(userSubscription.currentSubscriptions);
  }
  
  useFocusEffect(
    useCallback(() => {
      getUserSubscription()
    }, [])
  );

  return (
    <View style={styles.containerStyle}>
      {loading &&
        <ActivityIndicator style={styles.spinner}  size="large" animating={true}  />
      }
      {!loading &&
         <FlatList
         data={data}
         keyExtractor={item => item.id.toString()}
         renderItem={({item}) => (
           <AccordionItem title={item.title} code={item.code} description={item.description} sub={userSub}/>
         )}
       />
      }
   
    
  </View>
  )
  
  
}

const AccordionItem = ({title, code, description, sub}) => {
  const shareValue = useSharedValue(0);
  const [bodySectionHeight, setBodySectionHeight] = useState(0);
  
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
            {sub.includes(code) &&
              <FontAwesome name="chevron-down" size={24} color="black" onPress={toggleButton}/>
            }
            {!sub.includes(code) &&
              <FontAwesome name="shopping-cart" size={24} color="black" onPress={toggleButton}/>
            }
            {sub.includes("all") &&
              <FontAwesome name="chevron-down" size={24} color="black" onPress={toggleButton}/>
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
  spinner:{
    marginTop: 40
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