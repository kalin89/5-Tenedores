import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { ListItem } from 'react-native-elements';
import Modal from '../Modal';
import ChangeDisplaNameForm from './ChangeDisplayNameForm';
import ChangeEmailForm from './ChangeEmailForm';
import ChangePasswordForm from './ChangePasswordForm';

export default function AccountOptions(props) {
	const { userInfo, setReloadData, toastRef } = props;
	const [ isVisibleModal, setVisibleModal ] = useState(false);
	const [ renderComponet, setRenderComponet ] = useState(null);
	const menuOptions = [
		{
			title: 'Cambiar nombre y apellidos',
			iconType: 'material-community',
			iconNameLeft: 'account-circle',
			iconColorLeft: '#ccc',
			iconNameRight: 'chevron-right',
			iconColorRight: '#ccc',
			onPress: () => selectedComponent('displayName')
		},
		{
			title: 'Cambiar Email',
			iconType: 'material-community',
			iconNameLeft: 'at',
			iconColorLeft: '#ccc',
			iconNameRight: 'chevron-right',
			iconColorRight: '#ccc',
			onPress: () => selectedComponent('email')
		},
		{
			title: 'Cambiar contraseña',
			iconType: 'material-community',
			iconNameLeft: 'lock-reset',
			iconColorLeft: '#ccc',
			iconNameRight: 'chevron-right',
			iconColorRight: '#ccc',
			onPress: () => selectedComponent('password')
		}
	];

	const selectedComponent = (key) => {
		switch (key) {
			case 'displayName':
				setRenderComponet(
					<ChangeDisplaNameForm
						displayName={userInfo.displayName}
						setVisibleModal={setVisibleModal}
						setReloadData={setReloadData}
						toastRef={toastRef}
					/>
				);
				setVisibleModal(true);
				break;
			case 'email':
				setRenderComponet(
					<ChangeEmailForm
						email={userInfo.email}
						setVisibleModal={setVisibleModal}
						setReloadData={setReloadData}
						toastRef={toastRef}
					/>
				);
				setVisibleModal(true);
				break;
			case 'password':
				setRenderComponet(<ChangePasswordForm setVisibleModal={setVisibleModal} toastRef={toastRef} />);
				setVisibleModal(true);
				break;
			default:
				break;
		}
	};

	return (
		<View>
			{menuOptions.map((menu, index) => (
				<ListItem
					key={index}
					title={menu.title}
					leftIcon={{
						type: menu.iconType,
						name: menu.iconNameLeft,
						color: menu.iconColorLeft
					}}
					rightIcon={{
						type: menu.iconType,
						name: menu.iconNameRight,
						color: menu.iconColorRight
					}}
					onPress={menu.onPress}
					containerStyle={styles.menuItem}
				/>
			))}

			{renderComponet && (
				<Modal isVisible={isVisibleModal} setIsVisible={setVisibleModal}>
					{renderComponet}
				</Modal>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	menuItem: {
		borderBottomWidth: 1,
		borderBottomColor: '#e3e3e3'
	}
});
