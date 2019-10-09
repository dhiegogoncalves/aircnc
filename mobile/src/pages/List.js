import React, { useState, useEffect } from 'react';
import socketio from 'socket.io-client';
import {
  StyleSheet,
  ScrollView,
  SafeAreaView,
  AsyncStorage,
  Image,
  TouchableOpacity,
  Text,
  Alert
} from 'react-native';

import { API_URL } from 'react-native-dotenv';
import logo from '../assets/logo.png';
import SpotList from '../components/SpotList';

export default function List({ navigation }) {
  const [techs, setTechs] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem('user').then(user_id => {
      const socket = socketio(API_URL, {
        query: { user_id }
      });

      socket.on('booking_response', booking => {
        Alert.alert(
          `Sua reserva em ${booking.spot.company} em ${booking.date} foi ${
            booking.approved ? 'APROVADA' : 'REJEITADA'
          }`
        );
      });
    });
  }, []);

  useEffect(() => {
    AsyncStorage.getItem('techs').then(storagedTechs => {
      const techsArray = storagedTechs.split(',').map(tech => tech.trim());

      setTechs(techsArray);
    });
  }, []);

  async function logout() {
    await AsyncStorage.multiRemove(['user', 'techs']);
    navigation.navigate('Login');
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={logout} style={styles.button}>
        <Text style={styles.buttonText}>X</Text>
      </TouchableOpacity>
      <Image style={styles.logo} source={logo} />
      <ScrollView>
        {techs.map(tech => (
          <SpotList key={tech} tech={tech} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  logo: {
    height: 32,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 15
  },
  button: {
    width: 30,
    height: 26,
    backgroundColor: '#f05a5b',
    borderRadius: 2,
    marginTop: 50,
    marginRight: 20,
    alignSelf: 'flex-end'
  },
  buttonText: {
    flex: 1,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center'
  }
});
