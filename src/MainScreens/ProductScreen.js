import { Image, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { AuthContext } from '../Context/AuthContext'
import { firebase } from '../Firebase/FirebaseConfig'
import { Alert } from 'react-native'

const ProductScreen = ({ navigation, route }) => {
    const { userloggeduid } = useContext(AuthContext)

    const [quantity, setQuantity] = useState('0')
    const data = route.params;

    if (route.params === undefined) {
        navigation.navigate('HomeScreen')
    }

    const AddtoCartHandler = async () => {
        // Check if quantity is zero
        if (parseInt(quantity) === 0) {
            alert('Quantity must be greater than zero');
            return;
        }

        const date = new Date().getTime().toString();

        const docref = firebase.firestore().collection('UserCart').doc(userloggeduid);
        const foodData = {
            item_id: data.id,
            FoodQuantity: parseInt(quantity, 10),
            userid: userloggeduid,
            cartItemId: date + userloggeduid,
            totalFoodPrice: parseInt(data.FoodPrice) * parseInt(quantity),
        };

        try {
            const doc = await docref.get();
            if (doc.exists) {
                const cartItems = doc.data().cartItems;

                if (Array.isArray(cartItems)) {
                    const existingItemIndex = cartItems.findIndex((item) => item.item_id === data.id);

                    if (existingItemIndex !== -1) {
                        const existingItem = cartItems[existingItemIndex];
                        const updateditem = {
                            ...existingItem,
                            FoodQuantity: existingItem.FoodQuantity + parseInt(quantity, 10),
                        };

                        cartItems[existingItemIndex] = updateditem;

                        await docref.update({
                            cartItems: cartItems,
                        });
                        console.log('Updated');
                    } else {
                        await docref.update({
                            cartItems: firebase.firestore.FieldValue.arrayUnion(foodData),
                        });
                        console.log('Added');
                    }
                } else {
                    await docref.set({
                        cartItems: [foodData],
                    });
                    console.log('Added');
                }
            } else {
                await docref.set({
                    cartItems: [foodData],
                });
                console.log('Added');
            } 
            alert('Added to cart');
            setQuantity('0'); 
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const IncreaseQuantityHandler = () => {
        setQuantity((parseInt(quantity) + 1).toString())
    }
    const DescreaseQuantityHandler = () => {
        if (parseInt(quantity) > 1) {
            setQuantity((parseInt(quantity) - 1).toString())
        }
    }

    return (
        <ScrollView style={styles.container}>
            <StatusBar backgroundColor={'#080f17'} />
            
            {/* Back Arrow */}
            <TouchableOpacity
                style={styles.backArrow}
                onPress={() => navigation.navigate('HomeScreen')}
            >
                <Text style={styles.backArrowText}>x</Text>
            </TouchableOpacity>

            <View style={{ backgroundColor: '#080f17', paddingVertical: 15, paddingHorizontal: 15, height: 50, marginTop: 30 }} />

            <View style={styles.containerIn}>
                <View style={styles.containerIn1}>
                    <Image source={{ uri: data.FoodImageUrl }} style={styles.cardimage} />
                </View>

                <View style={styles.containerIn2}>
                    <View style={styles.containerIn2_s1}>
                        <Text style={styles.containerIn2_s1_foodname}>{data.FoodName}</Text>
                        <Text style={styles.containerIn2_s1_foodprice}>{data.FoodPrice}Rs</Text>
                    </View>

                    <View style={styles.containerIn2_s2}>
                        <Text style={styles.containerIn2_s2_head}>Food Details</Text>
                        <Text style={styles.containerIn2_s2_description}>{data.FoodDescp}</Text>
                    </View>

                
                    <View style={styles.containerIn2_rating_time}>
                        <View style={styles.ratingContainer}>
                            <Text style={styles.ratingText}>⭐ 4.8</Text>
                            <Text style={styles.ratingSubText}>Customer Rating</Text>
                        </View>
                        <View style={styles.timeContainer}>
                            <Text style={styles.timeText}>⏱ 30 mins</Text>
                            <Text style={styles.timeSubText}>Preparation Time</Text>
                        </View>
                    </View>

                    <View style={styles.containerIn2_s4}>
                        <Text style={styles.containerIn2_s4_heading}>Quantity</Text>
                        <View style={styles.containerIn2_s4_QuantityCont}>
                            <Text style={styles.containerIn2_s4_QuantityCont_MinusText} onPress={() => { DescreaseQuantityHandler() }}>-</Text>
                            <TextInput style={styles.containerIn2_s4_QuantityCont_TextInput} value={quantity} />
                            <Text style={styles.containerIn2_s4_QuantityCont_PlusText} onPress={() => { IncreaseQuantityHandler() }}>+</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.containerIn3}>
                    <TouchableOpacity style={styles.containerIn3_buybtn} onPress={() => { AddtoCartHandler() }}>
                        <Text style={styles.containerIn3_buybtn_txt}>Add to Cart</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
}

export default ProductScreen

const styles = StyleSheet.create({

    containerIn2_rating_time: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 15,
        padding: 15,
        marginVertical: 15,
        elevation: 2,
    },
    ratingContainer: {
        alignItems: 'center',
    },
    ratingText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#9d0000',
    },
    ratingSubText: {
        fontSize: 14,
        color: '#777',
        marginTop: 5,
    },
    timeContainer: {
        alignItems: 'center',
    },
    timeText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#009688',
    },
    timeSubText: {
        fontSize: 14,
        color: '#777',
        marginTop: 5,
    },
    container: {
        flex: 1,
        backgroundColor: '#ffffe3',
        width: '100%',
        height: '100%'
    },
    containerIn: {
        backgroundColor: '#ffffe3'
    },
    containerIn1: {
        width: '100%',
        height: 220,
        backgroundColor: '#ffffe3',
        alignItems: 'center',
        justifyContent: 'center'
    },

    cardimage: {
        width: '100%',
        height: '100%',

    },
    containerIn2: {
        width: '100%',
        padding: 20,
        position: 'relative',
        top: -30,
        backgroundColor: '#ffffe3',

    },
    containerIn2_s1: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        paddingHorizontal: 10
    },
    containerIn2_s1_foodname: {
        fontSize: 25,
        fontWeight: '800',
        width: 220,
        marginRight: 10,
        color:'#9d0000'
    },
    containerIn2_s1_foodprice: {
        fontSize: 26,
        fontWeight: '600',
        color:'#9d0000'
    },
    containerIn2_s2: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 17,
        borderRadius: 20,
    },
    containerIn2_s2_head: {
        fontSize: 18,
        fontWeight: '600',
    },
    containerIn2_s2_description: {
        paddingTop: 2,
        fontSize: 15,
    },

    containerIn2_s3: {
        backgroundColor: '#9d0000',
        width: '100%',

        padding: 20,
        borderRadius: 20,
        alignSelf: 'center',
        marginVertical: 10,
        elevation: 2,
        alignItems: 'center',
    },
    containerIn2_s3_restaurantnameheading: {
        color: '#ffffe3',
        fontSize: 20,
        fontWeight: '600',
    },
    containerIn2_s3_restaurantname: {
        color: '#ffffe3',
        fontSize: 16,
        fontWeight: '600',
        marginVertical: 10,
        alignItems: 'center',
    },
    containerIn3: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 0,
        flexDirection: 'row',
    },
    containerIn2_s4: {
        width: '90%',
        alignSelf: 'center',
        alignItems: 'center'
    },

    containerIn2_s4_heading: {
        color: '#9d0000',
        fontSize: 25,
        fontWeight: '800'
    },
    containerIn2_s4_QuantityCont: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 10,
    },
    containerIn2_s4_QuantityCont_MinusText: {
        backgroundColor: '#9d0000',

        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        elevation: 2,
        padding: 10,
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    containerIn2_s4_QuantityCont_TextInput: {
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        padding: 10,
        width: 50,
        borderRadius: 20,
        marginHorizontal: 10,
        fontSize: 20,
        textAlign: 'center',
    },
    containerIn2_s4_QuantityCont_PlusText: {
        backgroundColor: '#9d0000',

        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        elevation: 2,
        padding: 10,
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    containerIn3_buybtn: {
        width: '90%',
        height: 50,
        backgroundColor: '#9d0000',
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        color: 'black',
        alignSelf: 'center',
        marginBottom:60
    },
    containerIn3_buybtn_txt: {
        color: '#F2F2F2',
        paddingVertical: 5,
        fontSize: 17,
        borderRadius: 10,
        textAlign: 'center',
        fontWeight: '600',
        alignSelf: 'center'
    },
    backArrow: {
        position: 'absolute',
        top: 50,
        left: 20,
        zIndex: 10,
        backgroundColor: '#9d0000',
        borderRadius: 20,
        width: 35,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backArrowText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    }

});