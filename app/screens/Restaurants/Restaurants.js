import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ActionButton from 'react-native-action-button';
import ListRestaurants from '../../components/Restaurants/ListRestaurants';
// import * as firebase from 'firebase';
import { firebaseapp } from '../../utils/Firebase';
import firebase from 'firebase/app';
import 'firebase/firestore';
const db = firebase.firestore(firebaseapp);

export default function Restaurants(props) {
	const { navigation } = props;
	const [ user, setUser ] = useState(null);
	const [ restaurants, setRestaurants ] = useState([]);
	const [ startRestaurant, setStartRestaurant ] = useState(null);
	const [ isLoading, setIsLoading ] = useState(false);
	const [ totalRestaurants, setTotalRestaurants ] = useState(0);
	const [ isReloadRestaurant, setIsReloadRestaurant ] = useState(false);
	const limitRestaurant = 8;

	useEffect(() => {
		firebase.auth().onAuthStateChanged((userInfo) => {
			setUser(userInfo);
		});
	}, []);

	useEffect(
		() => {
			db.collection('restaurants').get().then((snap) => {
				setTotalRestaurants(snap.size);
			});
			(async () => {
				let resultRestaurants = [];
				const restaurants = db.collection('restaurants').orderBy('createAt', 'desc').limit(limitRestaurant);
				await restaurants.get().then((response) => {
					setStartRestaurant(response.docs[response.docs.length - 1]);
					response.forEach((doc) => {
						let restaurant = doc.data();
						restaurant.id = doc.id;
						resultRestaurants.push({ restaurant });
					});
					setRestaurants(resultRestaurants);
				});
			})();
			setIsReloadRestaurant(false);
		},
		[ isReloadRestaurant ]
	);

	const handlerLoaderMore = async () => {
		const resultRestaurants = [];
		restaurants.length < totalRestaurants && setIsLoading(true);

		const restaurantsDb = db
			.collection('restaurants')
			.orderBy('createAt', 'desc')
			.startAfter(startRestaurant.data().createAt)
			.limit(limitRestaurant);

		await restaurantsDb.get().then((response) => {
			if (response.docs.length > 0) {
				setStartRestaurant(response.docs[response.docs.length - 1]);
			} else {
				setIsLoading(false);
			}

			response.forEach((doc) => {
				let restaurant = doc.data();
				restaurant.id = doc.id;
				resultRestaurants.push({ restaurant });
			});
			setRestaurants([ ...restaurants, ...resultRestaurants ]);
		});
	};

	return (
		<View style={styles.viewBody}>
			<ListRestaurants restaurants={restaurants} isLoading={isLoading} handlerLoaderMore={handlerLoaderMore} />
			{user && <AddRestaurantButton navigation={navigation} setIsReloadRestaurant={setIsReloadRestaurant} />}
		</View>
	);
}

function AddRestaurantButton(props) {
	const { navigation, setIsReloadRestaurant } = props;
	return (
		<ActionButton
			buttonColor="#00a680"
			onPress={() => navigation.navigate('AddRestaurant', { setIsReloadRestaurant })}
		/>
	);
}

const styles = StyleSheet.create({
	viewBody: {
		flex: 1
	}
});
