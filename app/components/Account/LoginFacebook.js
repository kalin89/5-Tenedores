import React, {useState} from 'react';
import { SocialIcon } from 'react-native-elements';
import * as firebase from 'firebase';
import * as Facebook from 'expo-facebook';
import { FacebookApi} from '../../utils/Social';
import Loading from '../Loading';
import { View } from 'react-native';

export default function LoginFacebook(props){
    const {toastRef, navigation} = props;

    const [isLoading, setIsloading] = useState(false);

    const login = async () => {
        setIsloading(true);
        await Facebook.initializeAsync(FacebookApi.application_id);
        const {type, token} = await Facebook.logInWithReadPermissionsAsync({
            permissions: FacebookApi.permissions
        });

        if(type === "success"){
            const credentials = firebase.auth.FacebookAuthProvider.credential(token);
            await firebase.auth().signInWithCredential(credentials)
            .then(() => {
                navigation.navigate("MyAccount");
            })
            .catch((error) => {
                toastRef.current.show("Error accediendo con Facebook")
            })
        } else if(type === "cancel") {
            toastRef.current.show("Inicio de sesión cancelado")
        } else {
            toastRef.current.show("Error desconocido")
        }
        setIsloading(false);
    };

    return(
        <>
            <SocialIcon 
                title="Iniciar sesión con Facebook"
                button
                type="facebook"
                onPress={login}
            />
        <Loading isVisible={isLoading} text="Iniciando sesión" />
        </>
        
    )
}