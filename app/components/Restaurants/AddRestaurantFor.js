import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Alert, Dimensions, Text } from 'react-native';
import { Icon, Avatar, Image, Button } from 'react-native-elements';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';

export default function AddRestaurantForm(props) {
	const { navigation, setIsLoading, toastRef } = props;
	const [ imagesSelected, setImagesSelected ] = useState([]);

	return (
		<ScrollView>
			<UploadImage imagesSelected={imagesSelected} setImagesSelected={setImagesSelected} toastRef={toastRef} />
		</ScrollView>
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
				imagesSelected.map((img, index) => {
					console.log(`img ${index} = ${img}`);
				});
			}
		}
	};
	return (
		<View style={styles.viewImages}>
			<Icon
				type="material-community"
				name="camera"
				color="#7a7a7a"
				containerStyle={styles.containerIcon}
				onPress={imageSelected}
			/>

			{imagesSelected.map((imgeRestaurant) => {
				<Avatar
					key={imgeRestaurant}
					onPress={() => console.log('Eliminar imagen')}
					style={styles.miniatureStyle}
					source={{
						uri:
							'file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252F5-tenedores-70d891ec-6904-4fc3-b43f-5eb01a361eaf/ImagePicker/0a46a959-f8cf-4000-90a3-aef073ac60c4.jpg'
					}}
				/>;
			})}
		</View>
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
	}
});
