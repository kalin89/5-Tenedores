import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Toast from 'react-native-easy-toast';
import Loading from '../../components/Loading';
import AddRestaurantForm from '../../components/Restaurants/AddRestaurantFor';

export default function AddRestaurant(props) {
	const { navigation } = props;
	const { setIsReloadRestaurant } = navigation.state.params;
	const toastRef = useRef();
	const [ isLoading, setIsLoading ] = useState(false);

	return (
		<View style={styles.viewBody}>
			<AddRestaurantForm
				toastRef={toastRef}
				setIsLoading={setIsLoading}
				navigation={navigation}
				setIsReloadRestaurant={setIsReloadRestaurant}
			/>
			<Toast ref={toastRef} position="center" opacity={0.7} />
			<Loading isVisible={isLoading} text="Creando restaurante" />
		</View>
	);
}

const styles = StyleSheet.create({
	viewBody: {
		flex: 1
	}
});
