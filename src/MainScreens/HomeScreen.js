import { StyleSheet, Text, View,Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import Headerbar from '../Components/Headerbar';
import OfferSlider from '../Components/OfferSlider';
import CardSlider from '../Components/CardSlider';
import { firebase } from '../Firebase/FirebaseConfig';

const HomeScreen = ({ navigation }) => {
    const [foodData, setFoodData] = useState([]);

    const [userName, setUserName] = useState("");

    const foodDataQry = firebase.firestore().collection('FoodData');


    useEffect(() => {
        // Fetch food data
        foodDataQry.onSnapshot(snapshot => {
            setFoodData(snapshot.docs.map(doc => doc.data()));
        });

        const fetchUserName = async () => {
            const currentUser = firebase.auth().currentUser;
            if (currentUser) {
                const userDoc = await firebase.firestore().collection('users').doc(currentUser.uid).get();
                if (userDoc.exists) {
                    setUserName(userDoc.data().firstname);
                }
            }
        };
        fetchUserName();
    }, []);

    return (
        <View style={styles.mainContainer}>
            <StatusBar backgroundColor={'#080f17'} />

            <Headerbar />

            <OfferSlider />
            <CardSlider navigation={navigation} data={foodData} />
        </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({

    mainContainer: {
        flex: 1,
        height: '100%',
        backgroundColor: '#ffffe3',
    },
    banner: {
        width: '100%',
        backgroundColor: '#FF3F00',
        padding: 15,
        alignItems: 'center',
        borderRadius: 10,
        marginVertical: 10,
    },
    bannerText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
});
