import React, { useState, useEffect, useRef } from 'react';
import { View } from 'react-native';
import Toast from 'react-native-easy-toast';
import ListTopRestaurant from '../components/Ranking/ListTopRestaurants';

import { firebaseapp } from '../utils/Firebase';
import firebase from 'firebase/app';
import 'firebase/firestore';
const db = firebase.firestore(firebaseapp);

export default function TopRestaurants(props) {
	const { navigation } = props;
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
						let restaurant = doc.data();
						restaurant.id = doc.id;
						restaurantArray.push(restaurant);
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
			<ListTopRestaurant restaurants={restaurants} navigation={navigation} />
			<Toast ref={toastRef} opacity={1} />
		</View>
	);
}
