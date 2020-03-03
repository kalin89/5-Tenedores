import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Dimensions, ScrollView } from 'react-native';
import { Rating, ListItem, Icon } from 'react-native-elements';
import Carousel from '../../components/Carousel';
import Map from '../../components/Map';
import ListReviews from '../../components/Restaurants/ListReviews';
import Toast from 'react-native-easy-toast';

import { firebaseapp } from '../../utils/Firebase';
import firebase from 'firebase/app';
import 'firebase/firestore';

const db = firebase.firestore(firebaseapp);

const screenWidth = Dimensions.get('window').width;

export default function Restaurant(props) {
	const { navigation } = props;
	const { restaurant } = navigation.state.params;
	const [ imagesRestaurant, setImagesRestaurant ] = useState([]);
	const [ rating, setRating ] = useState(restaurant.rating);
	const [ isFavorite, setIsFavorite ] = useState(false);
	const [ userLogged, setUserLogged ] = useState(false);
	const toastRef = useRef();

	firebase.auth().onAuthStateChanged((user) => {
		user ? setUserLogged(true) : setUserLogged(false);
	});

	useEffect(() => {
		const arrayUrl = [];
		(async () => {
			await Promise.all(
				restaurant.images.map(async (Idimage) => {
					await firebase.storage().ref(`restaurant-images/${Idimage}`).getDownloadURL().then((imageUrl) => {
						arrayUrl.push(imageUrl);
					});
				})
			);
			setImagesRestaurant(arrayUrl);
		})();
	}, []);

	useEffect(() => {
		if (userLogged) {
			db
				.collection('favorites')
				.where('idRestaurant', '==', restaurant.id)
				.where('idUser', '==', firebase.auth().currentUser.uid)
				.get()
				.then((response) => {
					if (response.docs.length === 1) {
						setIsFavorite(true);
					}
				});
		}
	}, []);

	const addFavorite = () => {
		if (!userLogged) {
			toastRef.current.show('Necesitas estar logueado para agregar a favoritos', 2000);
		} else {
			const payload = {
				idUser: firebase.auth().currentUser.uid,
				idRestaurant: restaurant.id
			};

			db
				.collection('favorites')
				.add(payload)
				.then(() => {
					setIsFavorite(true);
					toastRef.current.show('restaurante agregado a favoritos');
				})
				.catch(() => {
					setIsFavorite(false);
					toastRef.current.show('restaurante agregado a favoritos');
				});
		}
	};

	const removeFavorito = () => {
		db
			.collection('favorites')
			.where('idRestaurant', '==', restaurant.id)
			.where('idUser', '==', firebase.auth().currentUser.uid)
			.get()
			.then((response) => {
				response.forEach((doc) => {
					const idFavorite = doc.id;
					db.collection('favorites').doc(idFavorite).delete().then(() => {
						setIsFavorite(false);
						toastRef.current.show('Restaurante eliminado de tus favoritos');
					});
				});
			})
			.catch(() => {
				toastRef.current.show('Error al borrar de mis favoritos');
			});
	};

	return (
		<ScrollView style={styles.viewBody}>
			<View style={styles.viewFavorite}>
				<Icon
					type="material-community"
					name={isFavorite ? 'heart' : 'heart-outline'}
					onPress={isFavorite ? removeFavorito : addFavorite}
					color={isFavorite ? '#00a680' : '#000000'}
					size={35}
					underlayColor="transparent"
				/>
			</View>
			<Carousel arrayImages={imagesRestaurant} width={screenWidth} height={200} />
			<TitleRestaurant name={restaurant.name} description={restaurant.description} rating={rating} />
			<RestaurantInfo location={restaurant.location} name={restaurant.name} addres={restaurant.addres} />
			<ListReviews navigation={navigation} idRestaurant={restaurant.id} setRating={setRating} />
			<Toast ref={toastRef} position="center" opacity={0.7} />
		</ScrollView>
	);
}

function TitleRestaurant(props) {
	const { name, description, rating } = props;
	return (
		<View style={styles.viewRestaurantTitle}>
			<View style={styles.viewRestaurantTitle}>
				<Rating style={styles.rating} imageSize={20} readonly startingValue={parseFloat(rating)} />
			</View>
			<Text style={styles.descriptionRestaurant}>{description}</Text>
		</View>
	);
}

function RestaurantInfo(props) {
	const { location, name, addres } = props;
	const listInfo = [
		{
			text: addres,
			iconName: 'map-marker',
			iconType: 'material-community',
			action: null
		},
		{
			text: '111 222 333',
			iconName: 'photo',
			iconType: 'material-community',
			action: null
		},
		{
			text: 'correo@hotmail.com',
			iconName: 'at',
			iconType: 'material-community',
			action: null
		}
	];

	return (
		<View style={styles.viewRestaurantInfo}>
			<Text style={styles.restaurantInfoTitle}>Información sobre el restaurante</Text>
			<Map location={location} name={name} height={100} />
			{listInfo.map((item, index) => (
				<ListItem
					key={index}
					title={item.text}
					leftIcon={{
						name: item.iconName,
						type: item.iconType,
						color: '#00a680'
					}}
					containerStyle={styles.containerListItem}
				/>
			))}
		</View>
	);
}

const styles = StyleSheet.create({
	viewBody: {
		flex: 1
	},
	viewFavorite: {
		position: 'absolute',
		top: 0,
		right: 0,
		zIndex: 2,
		backgroundColor: 'white',
		borderBottomLeftRadius: 100,
		paddingTop: 5,
		paddingBottom: 5,
		paddingLeft: 15,
		paddingRight: 5
	},
	viewRestaurantTitle: {
		margin: 15
	},
	nameRestaurant: {
		fontSize: 20,
		fontWeight: 'bold'
	},
	rating: {
		position: 'absolute',
		right: 0
	},
	descriptionRestaurant: {
		marginTop: 5,
		color: 'grey'
	},
	viewRestaurantInfo: {
		margin: 15,
		marginTop: 25
	},
	restaurantInfoTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 10
	},
	containerListItem: {
		borderBottomColor: '#8d8d8d',
		borderBottomWidth: 1
	}
});
