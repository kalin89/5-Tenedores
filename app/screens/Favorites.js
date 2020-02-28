import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Image } from 'react-native-elements';

import { firebaseapp } from '../utils/Firebase';
import firebase from 'firebase/app';
import 'firebase/firestore';
import Restaurant from './Restaurants/Restaurant';
const db = firebase.firestore(firebaseapp);

export default function Favorites(props) {
	const { navigation } = props;
	const [ restaurants, setRestaurants ] = useState([]);

	console.log(restaurants);

	useEffect(() => {
		const idUser = firebaseapp.auth().currentUser.uid;
		db.collection('favorites').where('idUser', '==', idUser).get().then((response) => {
			const idRestaurantsArray = [];
			response.forEach((doc) => {
				idRestaurantsArray.push(doc.data().idRestaurant);
			});
			getDataRestaurants(idRestaurantsArray).then((response) => {
				const restaurants = [];
				response.forEach((doc) => {
					let restaurant = doc.data();
					restaurant.id = doc.id;
					restaurants.push(restaurant);
				});
				setRestaurants(restaurants);
			});
		});
	}, []);

	const getDataRestaurants = (idRestaurantsArray) => {
		const arraRestaurants = [];
		idRestaurantsArray.forEach((idRestaurant) => {
			const result = db.collection('restaurants').doc(idRestaurant).get();
			arraRestaurants.push(result);
		});
		return Promise.all(arraRestaurants);
	};

	return (
		<View>
			<Text>Lista de favoritos</Text>
		</View>
	);
}
