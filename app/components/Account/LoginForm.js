import React, {useState} from 'react';
import { StyleSheet, View} from 'react-native';
import { Input, Icon, Button } from 'react-native-elements';
import { validateEmail } from '../../utils/Validations';
import * as firebase from 'firebase';
import { withNavigation } from 'react-navigation';
import Loading from '../Loading';

function LoginForm(props){
    const {toastRef, navigation} = props;
    const [hidePassword, setHidePassword] = useState(true);
    const [email, setEmail] = useState("");
    const [password, SetPassword] = useState("");
    const [isVisibleLoading, setVisibleLoadin] = useState(false);

    const login = async () => {
        setVisibleLoadin(true);
        if(!email || !password){
            toastRef.current.show("Todos los campos son obligatorios");
        }else {
           if(!validateEmail(email)){
            toastRef.current.show("El email no es valido");
           } else {
            await firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
                navigation.navigate("MyAccount");
            }).catch((error) => {
                toastRef.current.show("Email o contraseña incorrecta");
                console.log(error);
            })
           } 
        }
        setVisibleLoadin(false);
    }

    return(
        <View style={styles.formContainer}>
            <Input 
                placeholder="Correo eléctronico"
                containerStyle={styles.inputForm}
                onChange={e => setEmail(e.nativeEvent.text)}
                rightIcon={
                    <Icon
                        type="material-community"
                        name="at"
                        iconStyle={styles.iconRight} 
                    />
                }
            />
            <Input 
                placeholder="Password"
                containerStyle={styles.inputForm}
                password={true}
                secureTextEntry={hidePassword}
                onChange={e => SetPassword(e.nativeEvent.text)}
                rightIcon={
                    <Icon
                        type="material-community"
                        name={hidePassword ? "eye-outline" : "eye-off-outline" }
                        iconStyle={styles.iconRight} 
                        onPress={()=> setHidePassword(!hidePassword)}
                    />
                }
            />
            <Button 
                title="Iniciar sesión" 
                containerStyle={styles.btnContainerLogin}
                buttonStyle={styles.btnLogin}
                onPress={login}
            />
            <Loading isVisible={isVisibleLoading} text="Iniciando sesión" />
        </View>
    )
}

export default withNavigation(LoginForm);

const styles = StyleSheet.create({
    formContainer:{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 30
    },
    inputForm: {
        width:"100%",
        marginTop:20
    },
    iconRight: {
        color: "#c1c1c1"
    },
    btnContainerLogin:{
        marginTop: 20,
        width: "95%",
    },
    btnLogin:{
        backgroundColor: "#00a680"
    }
})