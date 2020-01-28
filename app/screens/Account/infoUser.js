import React from 'react';
import { View, Text, StyleSheet} from 'react-native';
import { Avatar} from 'react-native-elements';
import * as firebase from 'firebase';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';

export default function InfoUser(props){
    const {
        userInfo: { uid, displayName, photoURL, email }, setReloadData, toastRef, setIsLoading, setTextLoading
    } = props;

    const changeAvatar = async () =>{
        const resultPermision = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        const resultPermissionCamera = resultPermision.permissions.cameraRoll.status;
        
        if(resultPermissionCamera === "denied"){
            toastRef.current.show("Es necesario aceptar los permisos de la galeria");
        } else {
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4,3]
            })

            if(result.cancelled){
                toastRef.current.show("Has cerrado la galeria de imagenes");
            } else {
                uploadImage(result.uri, uid).then(()=>{
                    updatePhotoUrl(uid);
                });
            }
        }

    }

    const uploadImage = async (uri, nameImage) => {
        setTextLoading("Actualizando avatar");
        setIsLoading(true);
        const response = await fetch(uri);
        const blob = await response.blob();
        const ref = firebase.storage().ref().child(`avatar/${nameImage}`);
        return ref.put(blob);
    }

    const updatePhotoUrl = uid => {
        firebase.storage().ref(`avatar/${uid}`).getDownloadURL().then(async result => {
            const update = {
                photoURL: result
            }
            await firebase.auth().currentUser.updateProfile(update);
            setReloadData(true);
            setIsLoading(false);
        }).catch(()=>{
            toastRef.current.show("Error al recuperar avatar del servidor");
            setIsLoading(false);
        })
    }

    return(
        <View style={styles.viewUserInfo}>
            <Avatar
                rounded
                size="large"
                showEditButton
                onEditPress={changeAvatar}
                containerStyle={styles.userInfoAvatar}
                source={{
                    uri: photoURL ? photoURL : "https://api.adorable.io/avatars/150/abott@adorable.png"
                }}
            />
            <View>
                <Text style={styles.displayName}>
                    {displayName ? displayName : "Anónimo"}
                </Text>
                <Text>{email ? email : "Social Login"}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    viewUserInfo: {
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        backgroundColor: "#f2f2f2",
        paddingTop: 30,
        paddingBottom: 30
    },
    userInfoAvatar: {
        marginRight: 20
    },
    displayName: {
        fontWeight: "bold"
    }
});