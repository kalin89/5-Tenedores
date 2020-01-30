import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Input, Button } from 'react-native-elements';
import * as firebase from 'firebase';
import { reauthenticate } from '../../utils/Api';

export default function ChangePasswordForm(props) {
	const { setVisibleModal, toastRef } = props;
	const [ password, setPassword ] = useState('');
	const [ newPassword, setNewPassword ] = useState('');
	const [ newPasswordRepeat, setNewPasswordRepeat ] = useState('');
	const [ error, setError ] = useState({});
	const [ isLoading, setIsLoading ] = useState(false);
	const [ hidePassword, setHidePassword ] = useState(true);
	const [ hideNewPassword, setHideNewPassword ] = useState(true);
	const [ hideNewPasswordRpeat, sethideNewPasswordRpeat ] = useState(true);

	const updatePassword = () => {
		setError({});
		if (!password || !newPassword || !newPasswordRepeat) {
			let objError = {};
			!password && (objError.password = 'El password es requerido');
			!newPassword && (objError.newPassword = 'El nuevo password es requerido');
			!newPasswordRepeat && (objError.newPasswordRepeat = 'El campos es requerido');

			setError(objError);
		} else {
			if (newPassword !== newPasswordRepeat) {
				setError({
					newPassword: 'Las nuevas contraseñas deben coincidir',
					newPasswordRepeat: 'Las nuevas contraseñas deben coincidir'
				});
			} else {
				setIsLoading(true);
				reauthenticate(password)
					.then(() => {
						firebase
							.auth()
							.currentUser.updatePassword(newPassword)
							.then(() => {
								setIsLoading(false);
								toastRef.current.show('Contraseña actualizada correctamente');
								setVisibleModal(false);
							})
							.catch(() => {
								setError({ general: 'Error al actualizar la contraseña' });
								setIsLoading(false);
							});
					})
					.catch(() => {
						setError({
							password: 'La contraseña no es correcta'
						});
						setIsLoading(false);
					});
			}
		}
	};

	return (
		<View style={styles.view}>
			<Input
				placeholder="Contraseña actual"
				containerStyle={styles.input}
				password={true}
				secureTextEntry={hidePassword}
				onChange={(e) => setPassword(e.nativeEvent.text)}
				rightIcon={{
					type: 'material-community',
					name: hidePassword ? 'eye-outline' : 'eye-off-outline',
					color: '#c2c2c2',
					onPress: () => setHidePassword(!hidePassword)
				}}
				errorMessage={error.password}
			/>
			<Input
				placeholder="Nueva contraseña"
				containerStyle={styles.input}
				password={true}
				secureTextEntry={hideNewPassword}
				onChange={(e) => setNewPassword(e.nativeEvent.text)}
				rightIcon={{
					type: 'material-community',
					name: hideNewPassword ? 'eye-outline' : 'eye-off-outline',
					color: '#c2c2c2',
					onPress: () => setHideNewPassword(!hideNewPassword)
				}}
				errorMessage={error.newPassword}
			/>
			<Input
				placeholder="Repetir nueva contraseña"
				containerStyle={styles.input}
				password={true}
				secureTextEntry={hideNewPasswordRpeat}
				onChange={(e) => setNewPasswordRepeat(e.nativeEvent.text)}
				rightIcon={{
					type: 'material-community',
					name: hideNewPasswordRpeat ? 'eye-outline' : 'eye-off-outline',
					color: '#c2c2c2',
					onPress: () => sethideNewPasswordRpeat(!hideNewPasswordRpeat)
				}}
				errorMessage={error.newPasswordRepeat}
			/>
			<Button
				title="Cambiar contraseña"
				containerStyle={styles.containerStyle}
				buttonStyle={styles.btn}
				onPress={updatePassword}
				loading={isLoading}
			/>
			<Text>{error.general}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	view: {
		alignItems: 'center',
		paddingTop: 10,
		paddingTop: 10
	},
	input: {
		marginBottom: 10
	},
	btnContainer: {
		marginTop: 10,
		width: '95%'
	},
	btn: {
		backgroundColor: '#00a680'
	}
});
