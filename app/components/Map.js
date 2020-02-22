import React from 'react';
import MapView from 'react-native-maps';

export default function Map(props) {
	const { location, name, height } = props;

	return (
		<MapView
			style={{ height: height, width: '100%' }}
			initialRegion={location}
			onPress={() => console.log('Abriendo APP Map')}
		>
			<MapView.Marker
				coordinate={{
					latitude: location.latitude,
					longitude: location.longitude
				}}
			/>
		</MapView>
	);
}
