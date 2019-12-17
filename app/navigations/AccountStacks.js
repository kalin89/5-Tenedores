import { createStackNavigator } from 'react-navigation-stack';
import MyAccount from '../screens/Account/MyAccount';
import LoginScreen from '../screens/Account/Login';
import RegisterScreen from '../screens/Account/Register'

export const AccountScreenStacks = createStackNavigator({
    MyAccount: {
        screen: MyAccount,
        navigationOptions: () => ({
            title: "Mi cuenta"
        })
    },
    Login: {
        screen: LoginScreen,
        navigationOptions: () => ({
            title: "Mi cuenta"
        })
    },
    Register: {
        screen: RegisterScreen,
        navigationOptions: () => ({
            title: "Registro"
        })
    }
})

export default AccountScreenStacks;