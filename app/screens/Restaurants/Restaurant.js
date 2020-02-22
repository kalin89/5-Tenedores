import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Dimensions, ScrollView } from 'react-native';
import { Rating, ListItem } from 'react-native-elements';
import Carousel from '../../components/Carousel';
import Map from '../../components/Map';
import * as firebase from 'firebase';

const screenWidth = Dimensions.get('window').width;

export default function Restaurant(props) {
	const { navigation } = props;
	const { restaurant } = navigation.state.params.restaurant.item;
	const [ imagesRestaurant, setImagesRestaurant ] = useState([]);

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

	return (
		<ScrollView style={styles.viewBody}>
			<Text>Página de restaurante</Text>
			<Carousel arrayImages={imagesRestaurant} width={screenWidth} height={200} />
			<TitleRestaurant name={restaurant.name} description={restaurant.description} rating={restaurant.rating} />
			<RestaurantInfo location={restaurant.location} name={restaurant.name} addres={restaurant.addres} />
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
