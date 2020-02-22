import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Image } from 'react-native-elements';
import * as firebase from 'firebase';

export default function ListRestaurants(props) {
	const { restaurants, isLoading, handlerLoaderMore, navigation } = props;
	return (
		<View style={styles}>
			{restaurants ? (
				<FlatList
					data={restaurants}
					renderItem={(restaurant) => <Restaurant restaurant={restaurant} navigation={navigation} />}
					keyExtractor={(item, index) => index.toString()}
					onEndReached={handlerLoaderMore}
					onEndReachedThreshold={0}
					ListFooterComponent={<FooterList isLoading={isLoading} />}
				/>
			) : (
				<View style={styles.loadingRestaurants}>
					<ActivityIndicator size="large" />
					<Text>Cargando restaurantes</Text>
				</View>
			)}
		</View>
	);
}

function Restaurant(props) {
	const { restaurant, navigation } = props;
	const { name, addres, description, images } = restaurant.item.restaurant;
	const [ imageRestaurant, setImageRestaurant ] = useState(null);

	useEffect(() => {
		const image = images[0];
		firebase.storage().ref(`restaurant-images/${image}`).getDownloadURL().then((result) => {
			setImageRestaurant(result);
		});
	}, []);
	return (
		<TouchableOpacity onPress={() => navigation.navigate('Restaurant', { restaurant })}>
			<View style={styles.viewRestaurant}>
				<View style={styles.viewRestaurantImage}>
					<Image
						resizeMode="cover"
						source={{ uri: imageRestaurant }}
						style={styles.imageRestaurant}
						PlaceholderContent={<ActivityIndicator color="#fff" />}
					/>
				</View>
				<View>
					<Text style={styles.restaurantName}>{name}</Text>
					<Text style={styles.restaurantAddres}>{addres}</Text>
					<Text style={styles.restaurantDescription}>{description.substr(0, 60)}...</Text>
				</View>
			</View>
		</TouchableOpacity>
	);
}

function FooterList(props) {
	const { isLoading } = props;

	if (isLoading) {
		return (
			<View style={styles.loadingRestaurants}>
				<ActivityIndicator size="large" />
			</View>
		);
	} else {
		return (
			<View style={styles.notFoundRestaurants}>
				<Text>No quedan restaurantes por cargar</Text>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	loadingRestaurants: {
		marginTop: 20,
		alignItems: 'center'
	},
	viewRestaurant: {
		flexDirection: 'row',
		margin: 10
	},
	viewRestaurantImage: {
		marginRight: 15
	},
	imageRestaurant: {
		width: 80,
		height: 80
	},
	restaurantName: {
		fontWeight: 'bold'
	},
	restaurantAddres: {
		paddingTop: 2,
		color: 'grey'
	},
	restaurantDescription: {
		paddingTop: 2,
		color: 'grey',
		width: 300
	},
	loaderRestaurants: {
		marginTop: 2,
		color: 'grey',
		width: 300
	},
	notFoundRestaurants: {
		marginTop: 10,
		marginBottom: 20,
		alignItems: 'center'
	}
});
