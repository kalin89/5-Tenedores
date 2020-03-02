import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { Image, Icon } from 'react-native-elements';
import Loading from '../components/Loading';
import Toast from 'react-native-easy-toast';
import { NavigationEvents } from 'react-navigation';

import { firebaseapp } from '../utils/Firebase';
import firebase from 'firebase/app';
import 'firebase/firestore';
const db = firebase.firestore(firebaseapp);

export default function Favorites(props) {
	const { navigation } = props;
	const [ restaurants, setRestaurants ] = useState([]);
	const [ realoadrestaruant, setRealoadrestaruant ] = useState(false);
	const [ isVisibleLoading, setIsVisibleLoading ] = useState(false);
	const toastRef = useRef();

	useEffect(
		() => {
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
			setRealoadrestaruant(false);
		},
		[ realoadrestaruant ]
	);

	const getDataRestaurants = (idRestaurantsArray) => {
		const arraRestaurants = [];
		idRestaurantsArray.forEach((idRestaurant) => {
			const result = db.collection('restaurants').doc(idRestaurant).get();
			arraRestaurants.push(result);
		});
		return Promise.all(arraRestaurants);
	};

	if (restaurants.length === 0) return <NotFountRestaurant setRealoadrestaruant={setRealoadrestaruant} />;

	return (
		<View style={styles.viewBody}>
			<NavigationEvents onWillFocus={() => setRealoadrestaruant(true)} />
			{restaurants ? (
				<FlatList
					data={restaurants}
					renderItem={(restaurant) => (
						<Restaurant
							restaurant={restaurant}
							navigation={navigation}
							setIsVisibleLoading={setIsVisibleLoading}
							setRealoadrestaruant={setRealoadrestaruant}
							toastRef={toastRef}
						/>
					)}
					keyExtractor={(item, index) => index.toString()}
				/>
			) : (
				<View style={styles.loaderRestaurants}>
					<ActivityIndicator size="large" />
					<Text>Cargando Restaurants</Text>
				</View>
			)}
			<Toast ref={toastRef} position="center" opacity={1} />
			<Loading text="Eliminado restaurante" isVisible={isVisibleLoading} />
		</View>
	);
}

function Restaurant(props) {
	const { restaurant, navigation, setIsVisibleLoading, setRealoadrestaruant, toastRef } = props;
	const { id, name, images } = restaurant.item;
	const [ imageRestaurant, setImageRestaurant ] = useState(
		'https://matthewsenvironmentalsolutions.com/images/com_hikashop/upload/not-available.png'
	);

	useEffect(async () => {
		const image = images[0];
		await firebase
			.storage()
			.ref(`restaurant-images/${image}`)
			.getDownloadURL()
			.then((response) => {
				setImageRestaurant(response);
			})
			.catch((error) => console.log(error));
	}, []);

	const confirmRemoveFavorito = () => {
		Alert.alert(
			'Eliminar Restaurante de favoritos',
			'¿Estas seguro que quieres eliminar este restaurante de favoritos',
			[
				{
					text: 'Cancelar',
					style: 'cancel'
				},
				{
					text: 'Eliminar',
					onPress: removeFavorite
				}
			],
			{ cancelable: false }
		);
	};

	const removeFavorite = () => {
		setIsVisibleLoading(true);
		db
			.collection('favorites')
			.where('idRestaurant', '==', id)
			.where('idUser', '==', firebase.auth().currentUser.uid)
			.get()
			.then((response) => {
				response
					.forEach((doc) => {
						const idFavorite = doc.id;
						db.collection('favorites').doc(idFavorite).delete().then(() => {
							setIsVisibleLoading(false);
							//setRealoadrestaruant(true);
							toastRef.current.show('Restaurante eliminado de tus favoritos');
						});
					})
					.then(() => {
						setIsVisibleLoading(false);
						toastRef.current.show('Restaurante eliminado correctamente');
					});
			});
	};

	return (
		<View style={styles.restaurant}>
			<TouchableOpacity onPress={() => navigation.navigate('Restaurant', { restaurant: restaurant.item })}>
				<Image
					resizeMode="cover"
					source={{ uri: imageRestaurant }}
					style={styles.image}
					PlaceholderContent={<ActivityIndicator color="#fff" />}
				/>
			</TouchableOpacity>
			<View style={styles.info}>
				<Text style={styles.name}>{name}</Text>
				<Icon
					type="material-community"
					name="heart"
					color="#00a680"
					containerStyle={styles.favorite}
					onPress={confirmRemoveFavorito}
					size={40}
					underlayColor="transparent"
				/>
			</View>
		</View>
	);
}

function NotFountRestaurant(props) {
	const { setRealoadrestaruant } = props;
	return (
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
			<NavigationEvents onWillFocus={() => setRealoadrestaruant(true)} />
			<Icon type="material-community" name="alert-outline" size={50} />
			<Text style={{ fontSize: 20, fontWeight: 'bold' }}>No tienes restaurantes en tu lisgta</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	loaderRestaurants: {
		marginTop: 10,
		marginBottom: 10
	},
	viewBody: {
		flex: 1,
		backgroundColor: '#f2f2f2'
	},
	restaurant: {
		margin: 10
	},
	image: {
		width: '100%',
		height: 180
	},
	info: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'space-between',
		flexDirection: 'row',
		paddingLeft: 20,
		paddingRight: 20,
		paddingTop: 10,
		paddingBottom: 10,
		marginTop: -30,
		backgroundColor: '#fff'
	},
	name: {
		fontWeight: 'bold',
		fontSize: 20
	},
	favorite: {
		marginTop: -25,
		backgroundColor: '#fff',
		padding: 15,
		borderRadius: 100
	}
});
