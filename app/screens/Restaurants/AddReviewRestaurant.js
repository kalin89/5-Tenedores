import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { AirbnbRating, Button, Input } from 'react-native-elements';
import Toast from 'react-native-easy-toast';

export default function AddReviewRestaurant(props) {
	const { navigation } = props;
	const { idRestaurant } = navigation.state.params;
	const [ rating, setRating ] = useState(null);
	const [ title, setTitle ] = useState('');
	const [ review, setReview ] = useState('');

	const toasRef = useRef();

	const addReview = () => {
		if (rating === null) {
			toasRef.current.show('No has dado ninguna puntuación', 2000);
		} else if (!title) {
			toasRef.current.show('El titulo es obligatorio', 2000);
		} else if (!review) {
			toasRef.current.show('El comentario es obligatorio', 2000);
		} else {
			console.log('Enviar formulario');
		}
	};

	return (
		<View style={styles.viewBody}>
			<View styles={styles.viewRating}>
				<AirbnbRating
					count={5}
					reviews={[ 'Pesimo', 'Deficiente', 'Normal', 'Muy bueno', 'Excelente' ]}
					defaultRating={0}
					size={35}
					onFinishRating={(value) => setRating(value)}
				/>
			</View>
			<View styles={styles.formReview}>
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
		// flex: 1,
		// justifyContent: 'flex-end',
		marginTop: 20,
		marginBottom: 10,
		width: '95%'
	},
	btn: {
		backgroundColor: '#00a680'
	}
});
