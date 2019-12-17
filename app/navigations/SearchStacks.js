import { createStackNavigator } from 'react-navigation-stack';
import SerachScreen from '../screens/Search';

export const SearchScreenStacks = createStackNavigator({
    Restaurants: {
        screen: SerachScreen,
        navigationOptions: () => ({
            title: "Busca tu restaurante"
        })
    }
})

export default SearchScreenStacks;