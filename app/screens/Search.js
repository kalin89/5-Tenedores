import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { SearchBar, ListItem, Icon } from 'react-native-elements';
import * as firebase from 'firebase';

export default function Search(props) {
	const { navigation } = props;
	const [ restaurants, setRestaurants ] = useState([]);
	const [ search, setSearch ] = useState('');
	console.log(search);

	return (
		<View>
			<SearchBar
				placeholder="Busca tu restaurante"
				onChange={(e) => setSearch(e.nativeEvent.text)}
				value={search}
				containerStyle={styles.searchBar}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	searchBar: {
		marginBottom: 20
	}
});
