import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Card, Image, Rating } from 'react-native-elements';
import Toast from 'react-native-easy-toast';

import { firebaseapp } from '../utils/Firebase';
import firebase from 'firebase/app';
import 'firebase/firestore';
const db = firebase.firestore(firebaseapp);

export default function TopRestaurants() {
	const [ restaurants, setRestaurants ] = useState([]);
	const toastRef = useRef();

	useEffect(() => {
		(async () => {
			db
				.collection('restaurants')
				.orderBy('rating', 'desc')
				.limit(5)
				.get()
				.then((response) => {
					const restaurantArray = [];
					response.forEach((doc) => {
						restaurantArray.push(doc.data());
					});
					setRestaurants(restaurantArray);
				})
				.catch(() => {
					toastRef.current.show('Error al cargar el rating', 2000);
				});
		})();
	}, []);

	return (
		<View>
			<Text>Estamos en el ranking Restaurantes</Text>
			<Toast ref={toastRef} opacity={1} />
		</View>
	);
}
