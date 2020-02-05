import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Alert, Dimensions, Text } from 'react-native';
import { Icon, Avatar, Image, Button, Input } from 'react-native-elements';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import MapView from 'react-native-maps';
import Modal from '../Modal';
import * as Location from 'expo-location';
import uuid from 'uuid/v4';

import { firebaseapp } from '../../utils/Firebase';
import firebase from 'firebase/app';
import 'firebase/firestore';

const db = firebase.firestore(firebaseapp);

const widthScreen = Dimensions.get('window').width;

export default function AddRestaurantForm(props) {
	const { navigation, setIsLoading, toastRef, setIsReloadRestaurant } = props;
	const [ imagesSelected, setImagesSelected ] = useState([]);
	const [ restauranteName, setRestauranteName ] = useState('');
	const [ restaurantAddress, setRestaurantAddress ] = useState('');
	const [ restaurantDescription, setRestaurantDescription ] = useState('');
	const [ isVisibleMap, setisVisibleMap ] = useState(false);
	const [ locationRestaurant, setLocationRestaurant ] = useState(null);

	const addRestaurant = () => {
		if (!restauranteName || !restaurantAddress || !restaurantDescription) {
			toastRef.current.show('Todos los campos del formulario son obligatorios', 2000);
		} else if (imagesSelected.length === 0) {
			toastRef.current.show('El restaurante debe tener almenos una foto', 2000);
		} else if (!locationRestaurant) {
			toastRef.current.show('Tienes que localizar el restaurante en el mapa', 2000);
		} else {
			setIsLoading(true);
			uploadImageStorage(imagesSelected).then((arrayImages) => {
				db
					.collection('restaurants')
					.add({
						name: restauranteName,
						addres: restaurantAddress,
						description: restaurantDescription,
						location: locationRestaurant,
						images: arrayImages,
						rating: 0,
						ratingTotal: 0,
						quantityVoting: 0,
						createAt: new Date(),
						createBy: firebase.auth().currentUser.uid
					})
					.then(() => {
						setIsLoading(false);
						setIsReloadRestaurant(true);
						navigation.navigate('Restaurants');
					})
					.catch((error) => {
						setIsLoading(false);
						toastRef.current.show('Error al subir el restaurante');
					});
			});
		}
	};

	const uploadImageStorage = async (imageArray) => {
		const imagesBlob = [];
		await Promise.all(
			imageArray.map(async (image) => {
				const response = await fetch(image);
				const blob = await response.blob();
				const ref = firebase.storage().ref('restaurant-images').child(uuid());
				await ref.put(blob).then((result) => {
					imagesBlob.push(result.metadata.name);
				});
			})
		);
		return imagesBlob;
	};

	return (
		<ScrollView>
			<ImageRestaurant imageRestaurant={imagesSelected[0]} />
			<ForAdd
				setRestauranteName={setRestauranteName}
				setRestaurantAddress={setRestaurantAddress}
				setRestaurantDescription={setRestaurantDescription}
				setisVisibleMap={setisVisibleMap}
				locationRestaurant={locationRestaurant}
			/>
			<UploadImage imagesSelected={imagesSelected} setImagesSelected={setImagesSelected} toastRef={toastRef} />

			<Button title="Guardar restaurante" onPress={addRestaurant} buttonStyle={styles.btnAddRestaurant} />

			<Map
				isVisibleMap={isVisibleMap}
				setisVisibleMap={setisVisibleMap}
				setLocationRestaurant={setLocationRestaurant}
				toastRef={toastRef}
			/>
		</ScrollView>
	);
}

function ImageRestaurant(props) {
	const { imageRestaurant } = props;

	return (
		<View style={styles.viewPhoto}>
			{imageRestaurant ? (
				<Image source={{ uri: imageRestaurant }} style={{ width: widthScreen, height: 200 }} />
			) : (
				<Image
					source={require('../../../assets/img/no-image.png')}
					style={{ width: widthScreen, height: 200 }}
				/>
			)}
		</View>
	);
}

function UploadImage(props) {
	const { imagesSelected, setImagesSelected, toastRef } = props;
	const imageSelected = async () => {
		const resultPermissions = await Permissions.askAsync(Permissions.CAMERA_ROLL);
		const resultPermissionCamera = resultPermissions.permissions.cameraRoll.status;

		if (resultPermissionCamera === 'denied') {
			toastRef.current.show(
				'Es necesario aceptar los permisos de la galeria, ve a ajustes y cambialo manualmente',
				5000
			);
		} else {
			const result = await ImagePicker.launchImageLibraryAsync({
				allowsEditing: true,
				aspect: [ 4, 3 ]
			});

			if (result.cancelled) {
				toastRef.current.show('Has cerrado la galeria sin seleccionar niguna imagen');
			} else {
				setImagesSelected([ ...imagesSelected, result.uri ]);
			}
		}
	};

	const removeImage = (image) => {
		const arrayImages = imagesSelected;
		Alert.alert(
			'Eliminar imagen',
			'¿Estas seguro que quieres eliminar la imagen?',
			[
				{
					text: 'Cancelar',
					style: 'cancel'
				},
				{
					text: 'Eliminar',
					onPress: () => setImagesSelected(arrayImages.filter((imageUrl) => imageUrl !== image))
				}
			],
			{ cancelable: false }
		);
	};

	return (
		<View style={styles.viewImages}>
			{imagesSelected.length < 5 && (
				<Icon
					type="material-community"
					name="camera"
					color="#7a7a7a"
					containerStyle={styles.containerIcon}
					onPress={imageSelected}
				/>
			)}

			{imagesSelected.map((imageRestaurant) => (
				<Avatar
					key={imageRestaurant}
					onPress={() => removeImage(imageRestaurant)}
					style={styles.miniatureStyle}
					source={{ uri: imageRestaurant }}
				/>
			))}
		</View>
	);
}

function ForAdd(props) {
	const {
		setRestauranteName,
		setRestaurantAddress,
		setRestaurantDescription,
		setisVisibleMap,
		locationRestaurant
	} = props;
	return (
		<View style={styles.viewForm}>
			<Input
				placeholder="Nombre del restaurante"
				containerStyle={styles.input}
				onChange={(e) => setRestauranteName(e.nativeEvent.text)}
			/>
			<Input
				placeholder="Dirección"
				containerStyle={styles.input}
				onChange={(e) => setRestaurantAddress(e.nativeEvent.text)}
				rightIcon={{
					type: 'material-community',
					name: 'google-maps',
					color: locationRestaurant ? '#00a680' : '#e3e3e3',
					onPress: () => setisVisibleMap(true)
				}}
			/>
			<Input
				placeholder="Descripción del restaurante"
				multiline={true}
				inputContainerStyle={styles.textArea}
				onChange={(e) => setRestaurantDescription(e.nativeEvent.text)}
			/>
		</View>
	);
}

function Map(props) {
	const { isVisibleMap, setisVisibleMap, setLocationRestaurant, toastRef } = props;
	const [ location, setLocation ] = useState(null);

	useEffect(() => {
		(async () => {
			let resultPermissions = await Permissions.askAsync(Permissions.LOCATION);
			const statusPermissions = resultPermissions.permissions.location.status;

			if (statusPermissions !== 'granted') {
				toastRef.current.show(
					'Tienes que aceptar los permisos de localización para crear un restaurante.',
					5000
				);
			} else {
				const loc = await Location.getCurrentPositionAsync({});
				setLocation({
					latitude: loc.coords.latitude,
					longitude: loc.coords.longitude,
					latitudeDelta: 0.001,
					longitudeDelta: 0.001
				});
			}
		})();
	}, []);

	const confirmLocation = () => {
		setLocationRestaurant(location);
		toastRef.current.show('Localización guardada correctamente');
		setisVisibleMap(false);
	};

	return (
		<Modal isVisible={isVisibleMap} setVisible={setisVisibleMap}>
			<View>
				{location && (
					<MapView
						style={styles.mapStyle}
						initialRegion={location}
						showsUserLocation={true}
						onRegionChange={(region) => setLocation(region)}
					>
						<MapView.Marker
							coordinate={{
								latitude: location.latitude,
								longitude: location.longitude
							}}
							draggable
						/>
					</MapView>
				)}
				<View style={styles.viewMapBtn}>
					<Button
						title="Guardar Ubicación"
						onPress={confirmLocation}
						containerStyle={styles.viewMapBtnContainerSave}
						buttonStyle={styles.viewMapBtnSave}
					/>
					<Button
						title="Cancelar"
						onPress={() => setisVisibleMap(false)}
						containerStyle={styles.viewMapBtnContainerCancel}
						buttonStyle={styles.viewMapBtnCancel}
					/>
				</View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	viewImages: {
		flexDirection: 'row',
		marginLeft: 20,
		marginRight: 20,
		marginTop: 30
	},
	containerIcon: {
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 10,
		height: 70,
		width: 70,
		backgroundColor: '#e3e3e3'
	},
	miniatureStyle: {
		width: 70,
		height: 70,
		marginRight: 10
	},
	viewPhoto: {
		alignItems: 'center',
		height: 200,
		marginBottom: 20
	},
	viewForm: {
		marginLeft: 10,
		marginRight: 10
	},
	input: {
		marginBottom: 10
	},
	textArea: {
		height: 100,
		width: '100%',
		padding: 0,
		margin: 0
	},
	mapStyle: {
		width: '100%',
		height: 550
	},
	viewMapBtn: {
		flexDirection: 'row',
		justifyContent: 'center',
		marginTop: 10
	},
	viewMapBtnContainerSave: {
		paddingRight: 5
	},
	viewMapBtnSave: {
		backgroundColor: '#00a680'
	},
	viewMapBtnContainerCancel: {
		paddingLeft: 5
	},
	viewMapBtnCancel: {
		backgroundColor: '#a60d0d'
	},
	btnAddRestaurant: {
		backgroundColor: '#00a680',
		margin: 20
	}
});
