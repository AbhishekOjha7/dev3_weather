import {
  View,
  Text,
  Image,
  FlatList,
  Platform,
  SafeAreaView,
  ImageBackground,
  TouchableOpacity,
  PermissionsAndroid,
  NativeModules,
} from 'react-native';
import React from 'react';
import localImages from '../../utils/localImages';
import {getWeatherApi} from '../../redux/action/index';
import LinearGradient from 'react-native-linear-gradient';
import Geolocation from '@react-native-community/geolocation';
import {useDispatch, useSelector} from 'react-redux';

export default function HomeScreen() {
  const dispatch = useDispatch();
  const [location, setLocation] = React.useState({
    lat: 0,
    long: 0,
  });
  const [active, setActive] = React.useState(1);
  const {HEIGHT} = NativeModules?.StatusBarManager;
  const {current, currentLocation} = useSelector(
    Store => Store.ForecastReducer,
  );
  console.log();

  console.log('current', current);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Weather App Location Permission',
            message: 'Weather App needs access to your location',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          Geolocation.getCurrentPosition(
            position => {
              console.log(position);
              setLocation({
                lat: position.coords.latitude,
                long: position.coords.longitude,
              });
              const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=437b42a4ae70478eb8271532230903&q=${position.coords.latitude},${position.coords.longitude}&days=5&aqi=yes&alerts=yes`;
              dispatch(wetherApi(apiUrl));
            },
            error => console.log(error),
            {
              enableHighAccuracy: true,
              timeout: 15000,
              maximumAge: 10000,
            },
          );
        } else {
          console.log('deined');
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      Geolocation.getCurrentPosition(
        position => {
          console.log(position);
          setLocation({
            lat: position.coords.latitude,
            long: position.coords.longitude,
          });
          const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=437b42a4ae70478eb8271532230903&q=${position.coords.latitude},${position.coords.longitude}&days=5&aqi=yes&alerts=yes`;
          dispatch(wetherApi(apiUrl));
        },
        error => console.log(error),
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        },
      );
    }
  };

  const next = () => {};

  const wetherApi = apiUrl =>
    getWeatherApi(
      apiUrl,
      response => {},
      errorResponse => {
        console.log(errorResponse);
      },
    );

  React.useEffect(() => {
    requestLocationPermission();
  }, []);

  const activeButton = tab => {
    if (tab) {
      setActive(0);
    } else {
      setActive(1);
    }
  };

  return (
    <LinearGradient
      style={{alignItems: 'center', flex: 1, paddingTop: HEIGHT}}
      colors={['#064C61', '#08151E', '#08151E']}>
      <Text
        style={{
          marginTop: 30,
          color: '#FFFFFF',
          fontSize: 39.88,
          fontWeight: '500',
          textAlign: 'center',
        }}>
        {currentLocation?.country}
      </Text>
      <Text style={{color: 'lightgrey', fontSize: 15}}>{'10 Dec, 2022'}</Text>
      <View
        style={{
          marginTop: 30,
          borderRadius: 10,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#135275',
        }}>
        <CustomButton
          titleStyle={{
            fontSize: 16,
            fontWeight: '500',
            color: active ? 'white' : '#CFDCE3',
          }}
          onPress={() => activeButton(0)}
          title={'Forecast'}
          container={{
            width: 125,
            height: 48,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: active ? '#4084DF' : '#135275',
          }}
        />
        <CustomButton
          titleStyle={{
            fontSize: 16,
            fontWeight: '500',
            color: active ? '#CFDCE3' : 'white',
          }}
          onPress={() => activeButton(1)}
          title={'Air Quality'}
          container={{
            width: 125,
            height: 48,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: active ? '#135275' : '#4084DF',
          }}
        />
      </View>
      <Image
        source={localImages.cloudIcon}
        style={{width: 237, height: 247, alignSelf: 'center'}}
      />
      <Text
        style={{
          color: '#FFFFFF',
          fontSize: 39.88,
          fontWeight: '900',
        }}>
        {current.temp_c}
      </Text>
      <Text
        style={{
          color: 'lightgrey',
        }}>
        {current?.condition?.text}
      </Text>
      <View
        style={{
          width: '90%',
          marginVertical: 20,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text style={{color: 'white', fontSize: 20}}>Today</Text>
        <Text style={{color: '#5491E2', fontSize: 21}}>View Full Report</Text>
      </View>
      <FlatList
        data={['', '', '', '', '', '', '', '', '', '', '', '', '', '', '']}
        horizontal
        style={{width: '90%', borderRadius: 13, backgroundColor: '#2566A333'}}
        bounces={false}
        contentContainerStyle={{
          paddingRight: 15,
          paddingVertical: 20,
        }}
        renderItem={() => {
          return (
            <View
              style={{
                padding: 16,
                marginLeft: 15,
                borderRadius: 25,
              }}>
              <Text style={{color: 'white', fontSize: 23}}>28°C</Text>
            </View>
          );
        }}
      />
    </LinearGradient>
  );
}

export const CustomButton = ({...props}) => {
  return (
    <TouchableOpacity
      style={props.container}
      onPress={props.onPress}
      activeOpacity={0.7}>
      <Text style={props.titleStyle}>{props.title}</Text>
    </TouchableOpacity>
  );
};
