import { createStackNavigator } from 'react-navigation-stack';
import FavoritesScreen from '../screens/Favorites';

const FavoritesScreenStack = createStackNavigator({
	Favorites: {
		screen: FavoritesScreen,
		navigationOptions: () => ({
			title: 'Restaurantes Favoritos'
		})
	}
});

export default FavoritesScreenStack;
