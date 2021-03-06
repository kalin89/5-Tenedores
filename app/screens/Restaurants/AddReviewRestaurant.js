import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { AirbnbRating, Button, Input } from 'react-native-elements';
import Toast from 'react-native-easy-toast';
import Loading from '../../components/Loading';

import { firebaseapp } from '../../utils/Firebase';
import firebase from 'firebase/app';
import 'firebase/firestore';
const db = firebase.firestore(firebaseapp);

export default function AddReviewRestaurant(props) {
	const { navigation } = props;
	const { idRestaurant, setReviewsReload } = navigation.state.params;
	const [ rating, setRating ] = useState(null);
	const [ title, setTitle ] = useState('');
	const [ review, setReview ] = useState('');
	const [ isLoading, setIsLoading ] = useState(false);
	const toasRef = useRef();

	const addReview = () => {
		setIsLoading(true);
		if (rating === null) {
			setIsLoading(false);
			toasRef.current.show('No has dado ninguna puntuación', 2000);
		} else if (!title) {
			setIsLoading(false);
			toasRef.current.show('El titulo es obligatorio', 2000);
		} else if (!review) {
			setIsLoading(false);
			toasRef.current.show('El comentario es obligatorio', 2000);
		} else {
			const user = firebase.auth().currentUser;
			const payload = {
				idUser: user.uid,
				avatarUser: user.photoURL,
				idRestaurant: idRestaurant,
				title: title,
				review: review,
				rating: rating,
				createAt: new Date()
			};

			db
				.collection('reviews')
				.add(payload)
				.then(() => {
					upDateRestaurant();
				})
				.catch(() => {
					toasRef.current.show('Error al enviar el review, intentelo mas tarde');
					setIsLoading(false);
				});
		}
	};

	const upDateRestaurant = () => {
		const restaurantRef = db.collection('restaurants').doc(idRestaurant);
		restaurantRef.get().then((response) => {
			const restaurantData = response.data();
			const ratingTotal = restaurantData.ratingTotal + rating;
			const quantityVoting = restaurantData.quantityVoting + 1;
			const ratingResult = ratingTotal / quantityVoting;

			restaurantRef.update({ rating: ratingResult, ratingTotal, quantityVoting }).then(() => {
				setIsLoading(false);
				setReviewsReload(true);
				navigation.goBack();
			});
		});
	};

	return (
		<View style={styles.viewBody}>
			<View style={styles.viewRating}>
				<AirbnbRating
					count={5}
					reviews={[ 'Pesimo', 'Deficiente', 'Normal', 'Muy bueno', 'Excelente' ]}
					defaultRating={0}
					size={35}
					onFinishRating={(value) => setRating(value)}
				/>
			</View>
			<View style={styles.formReview}>
				<Input
					placeholder="Titulo"
					containerStyle={styles.input}
					onChange={(e) => setTitle(e.nativeEvent.text)}
				/>
				<Input
					placeholder="Comentario"
					multiline={true}
					inputContainerStyle={styles.textArea}
					onChange={(e) => setReview(e.nativeEvent.text)}
				/>
				<Button
					title="Enviar comentario"
					onPress={addReview}
					containerStyle={styles.btnContainer}
					buttonStyle={styles.btn}
				/>
			</View>
			<Toast ref={toasRef} position="center" opacity={0.7} />
			<Loading isVisible={isLoading} text={'Enviando comentario'} />
		</View>
	);
}

const styles = StyleSheet.create({
	viewBody: {
		flex: 1
	},
	viewRating: {
		height: 110,
		backgroundColor: '#f2f2f2'
	},
	formReview: {
		flex: 1,
		alignItems: 'center',
		margin: 10,
		marginTop: 40
	},
	input: {
		marginBottom: 10
	},
	textArea: {
		height: 150,
		width: '100%',
		padding: 0,
		margin: 0
	},
	btnContainer: {
		flex: 1,
		justifyContent: 'flex-end',
		marginTop: 20,
		marginBottom: 10,
		width: '95%'
	},
	btn: {
		backgroundColor: '#00a680'
	}
});
