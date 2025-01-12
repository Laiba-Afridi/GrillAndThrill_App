import { StyleSheet, Text, TouchableOpacity, View, Image, FlatList, TextInput, ScrollView } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Context/AuthContext';
import { firebase } from '../Firebase/FirebaseConfig';
import { useFocusEffect } from '@react-navigation/native';
import { LogBox } from 'react-native';
import {Alert} from 'react-native';

   LogBox.ignoreLogs([
    'VirtualizedLists should never be nested inside plain ScrollViews',
  ]);

    const UserCartScreen = ({ navigation }) => {
        
    const { userloggeduid } = useContext(AuthContext);

    const [cartdata, setCartdata] = useState(null);
    const [cartAlldata, setCartAlldata] = useState([]); 
    const [foodDataAll, setFoodDataAll] = useState([]);
    const [totalCost, setTotalCost] = useState('0');
    const [paymentpage, setPaymentPage] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('COD'); 
    const [deliveryLocation, setDeliveryLocation] = useState(''); 
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');

    // Fetching cart data
    const cardDataHandler = async () => {
        const docref = firebase.firestore().collection('UserCart').doc(userloggeduid);
        try {
            await docref.get().then((doc) => {
                if (doc.exists) {
                    setCartdata(doc.data());
                    setCartAlldata(doc.data().cartItems || []);
                } else {
                    console.log('There is no data in the cart');
                }
            });
        } catch (error) {
            console.log('Error fetching cart data:', error);
        }
    };

    useEffect(() => {
        cardDataHandler();
    }, []);

    // Fetching food data
    const FoodDataHandler = async () => {
        const foodRef = firebase.firestore().collection('FoodData');
        foodRef.onSnapshot(snapshot => {
            setFoodDataAll(snapshot.docs.map(doc => doc.data()));
        });
    };

    useEffect(() => {
        FoodDataHandler();
    }, []);
     
    const TotalPriceHandler = () => {
        if (cartAlldata && cartAlldata.length > 0) {
            let totalfoodprice = 0;
            cartAlldata.forEach((item) => {
                totalfoodprice += parseInt(item.totalFoodPrice);
            });
            setTotalCost(totalfoodprice.toString());
        } else {
            setTotalCost('0');
        }
    };


    useEffect(() => {
        TotalPriceHandler();
    }, [cartAlldata]);
   
    //update item
    const updateCartItem = async (updatedItem, remove = false) => {
        const docref = firebase.firestore().collection('UserCart').doc(userloggeduid);
        const docSnapshot = await docref.get();
        if (docSnapshot.exists) {
            let updatedCartItems;
            if (remove) {
                updatedCartItems = cartAlldata.filter((item) => item.item_id !== updatedItem.item_id);
                Alert.alert(
                    'Item Removed',
                    `Item has been removed from the cart.`,
                    [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
                );
            } else {
                updatedCartItems = cartAlldata.map((item) =>
                    item.item_id === updatedItem.item_id ? updatedItem : item
                );
            }

            await docref.update({
                cartItems: updatedCartItems,
            });
            setCartAlldata(updatedCartItems);
        }
    };

    // Handling close action
    const closeCart = () => {
        setPaymentPage(false); // Reset payment page state when going back to cart
        navigation.navigate('UserCartScreen'); 
    };


    // Handle place order functionality
     const PlaceNow = async () => {

    // Check for delivery location
    if (!deliveryLocation.trim()) {
        alert('Please provide a delivery location.');
        return;
    }

    if (selectedPaymentMethod === 'Card') {
        if (!cardNumber.trim() || !expiryDate.trim() || !cvv.trim()) {
            alert('Please fill in all card details.');
            return;
        }
    }

    const cDate = new Date().getTime().toString();
    const docid = new Date().getTime().toString() + userloggeduid;
    const orderdatadoc = firebase.firestore().collection('UserOrders').doc(docid);
    const orderitemstabledoc = firebase.firestore().collection('OrderItems').doc(docid);

    try {
        // Update order data
        if (cartdata !== null) {
            const updatedData = { ...cartdata };
            updatedData.cartItems.forEach((item) => {
                item.orderId = docid;
                item.orderDate = cDate;
            });
            await orderitemstabledoc.set({ ...updatedData });
            await orderdatadoc.set({
                orderid: docid,
                orderstatus: 'Pending',
                ordercost: totalCost,
                orderdate: cDate,
                userid: userloggeduid,
                userpayment: selectedPaymentMethod,
                deliveryLocation: deliveryLocation,
            });

            // Remove cart after order is placed
            await deleteCart();
            alert('Order placed successfully.');

            setCartAlldata([]);
        }
    } catch (error) {
        console.error('Error placing order:', error);
        alert('Failed to place the order. Please try again.');
           }
       };

      // Delete cart after order placement
      const deleteCart = async () => {
          const docRef = firebase.firestore().collection('UserCart').doc(userloggeduid);
          const docSnapshot = await docRef.get();
          if (docSnapshot.exists) {
              await docRef.delete();
              console.log('Cart successfully cleared.');
          } else {
              console.log('Cart does not exist.');
          }
      };


    useFocusEffect(
        React.useCallback(() => {
            cardDataHandler();
            TotalPriceHandler();
            setPaymentPage(false); 
            console.log('triggered cart');
        }, [])
    );

    if (paymentpage) {
        return (
            <View style={styles.mainContainer}>
                <View style={{ backgroundColor: '#080f17', paddingVertical: 15, paddingHorizontal: 15, marginTop: 30 }}>
                    <TouchableOpacity onPress={closeCart}>
                        <Text style={{ fontSize: 16, color: 'white' }}>Close</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView style={styles.container}>
                    <Text style={styles.PaymenText1}>Payment Options</Text>

                    {/* Payment Method Selection */}
                    <TouchableOpacity
                        style={[styles.paymentButton, { backgroundColor: selectedPaymentMethod === 'COD' ? '#9d0000' : '#ddd' }]}
                        onPress={() => setSelectedPaymentMethod('COD')}
                    >
                        <Text style={styles.paymentText}>Cash on Delivery</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.paymentButton, { backgroundColor: selectedPaymentMethod === 'Card' ? '#9d0000' : '#ddd' }]}
                        onPress={() => setSelectedPaymentMethod('Card')}
                    >
                        <Text style={styles.paymentText}>Pay via Card</Text>
                    </TouchableOpacity>

                    {/* Inputs based on Payment Method */}
                    {selectedPaymentMethod === 'Card' && (
                        <>
                            <Text style={styles.inputLabel}>Card Number</Text>
                            <TextInput
                                style={styles.inputField}
                                placeholder="Enter your card number"
                                keyboardType="numeric"
                                value={cardNumber}
                                onChangeText={setCardNumber}
                            />
                            <Text style={styles.inputLabel}>Expiry Date</Text>
                            <TextInput
                                style={styles.inputField}
                                placeholder="MM/YY"
                                keyboardType="numeric"
                                value={expiryDate}
                                onChangeText={setExpiryDate}
                            />
                            <Text style={styles.inputLabel}>CVV</Text>
                            <TextInput
                                style={styles.inputField}
                                placeholder="Enter CVV"
                                keyboardType="numeric"
                                secureTextEntry
                                value={cvv}
                                onChangeText={setCvv}
                            />
                        </>
                    )}

                    {/* Delivery Location */}
                    <Text style={styles.inputLabel}>Delivery Location</Text>
                    <TextInput
                        style={styles.inputField}
                        placeholder="Enter your delivery location"
                        value={deliveryLocation}
                        onChangeText={setDeliveryLocation}
                    />

                    {/* Place Order Button */}
                    <TouchableOpacity style={styles.placeOrderButton} onPress={PlaceNow}>
                        <Text style={styles.paymentText}>Place Order</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        );
    }

    return (
        <View style={styles.mainContainer}>
            <View style={{ backgroundColor: '#080f17', paddingVertical: 15, paddingHorizontal: 15, marginTop: 25, marginBottom:23}}>

            </View>
            <Text style={styles.containerHead}>Checkout Items</Text>
            <View style={styles.container}>
                <FlatList
                    style={styles.FlatListCont}
                    data={cartAlldata}
                    renderItem={({ item }) => {
                        const nData = foodDataAll.find((food) => food.id === item.item_id);
                        if (!nData) return null;
                        

                        const increaseQuantity = async () => {
                            const updatedItem = { ...item, FoodQuantity: item.FoodQuantity + 1 };
                            updatedItem.totalFoodPrice = updatedItem.FoodQuantity * nData.FoodPrice;
                            await updateCartItem(updatedItem);
                        };

                        const decreaseQuantity = async () => {
                            if (item.FoodQuantity > 1) {
                                const updatedItem = { ...item, FoodQuantity: item.FoodQuantity - 1 };
                                updatedItem.totalFoodPrice = updatedItem.FoodQuantity * nData.FoodPrice;
                                await updateCartItem(updatedItem);
                            } else {
                                await updateCartItem(item, true);
                            }
                        };
                        return (
                            <View style={styles.containerCardList}>
                                <View style={styles.containerCard}>
                                    <Image source={{ uri: nData.FoodImageUrl }} style={styles.cardimage} />
                                    <View style={styles.cardtextview}>
                                        <Text style={styles.cardtext}>{nData.FoodName}</Text>
                                        <Text style={styles.cardtext}>Quantity:{item.FoodQuantity}</Text>
                                        <Text style={styles.cardtext}>Total: {item.totalFoodPrice}</Text>
                                    </View>
                                    
                                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                            <TouchableOpacity style={styles.deletebtn} onPress={decreaseQuantity}>
                                                <Text style={styles.deletebtnText}>-</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.deletebtn} onPress={increaseQuantity}>
                                                <Text style={styles.deletebtnText}>+</Text>
                                            </TouchableOpacity>
                                        </View>
                                </View>
                            </View>
                        );
                    }}
                    keyExtractor={(item, index) => index.toString()}
                />
                {cartAlldata.length > 0 && (
                    <TouchableOpacity style={styles.checkoutbtn} onPress={() => setPaymentPage(true)}>
                        <Text style={styles.paymentText}>Proceed to Checkout</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: { 
        flex: 1,
        backgroundColor: '#ffffe3',
    },
    container: {
        flex: 1,
        backgroundColor: '#ffffe3',
    },
    containerHead: {
        fontSize: 25,
        fontWeight: '800',
        paddingHorizontal: 30,
        paddingBottom:10,
        color: '#9d0000',
    },
    PaymenText1:{
        fontSize: 25,
        fontWeight: '800',
        paddingVertical: 15,
        paddingHorizontal: 20,
        color: '#9d0000',
    },
    cartout: {
        marginTop: 15,
        paddingHorizontal: 16,
    },
    checkoutbtn: {
        backgroundColor: '#9d0000',
        paddingVertical: 15,
        marginVertical: 20,
        marginHorizontal: 20,
        borderRadius: 25,
        elevation: 5,
        shadowColor: 'black',
        shadowOpacity: 0.2,
        shadowOffset: { height: 3, width: 3 },
        shadowRadius: 5,
    },
    paymentText: {
        textAlign: 'center',
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
    },
    containerCardList: {
        marginBottom: 10,
    },
    containerCard: {
        flexDirection: 'row',
        padding: 15,
        backgroundColor: '#ffffff',
        borderRadius: 15,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowOffset: { height: 3, width: 3 },
        shadowRadius: 5,
        marginHorizontal: 15,
    },
    cardimage: {
        width: 80,
        height: 80,
        borderRadius: 10,
    },
    cardtextview: {
        flex: 1,
        marginLeft: 15,
        justifyContent: 'space-around',
    },
    cardtext: {
        fontSize: 16,
        color: '#333',
        marginBottom: 3,
    },
    deletebtn: {
        backgroundColor: '#9d0000',
        padding: 10,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginHorizontal: 5,
    },
    deletebtnText: {
        color: 'white',
        fontSize: 14,
    },
    FlatListCont: {
        paddingHorizontal: 10,
    },
    inputField: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
        marginHorizontal: 15,
        marginVertical: 10,
        borderColor: '#ddd',
        borderWidth: 1,
        fontSize: 16,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '600',
        paddingVertical: 5,
        paddingHorizontal: 15,
        color: '#333',
    },
    placeOrderButton: {
        backgroundColor: '#9d0000',
        paddingVertical: 15,
        marginVertical: 20,
        marginHorizontal: 20,
        borderRadius: 25,
        elevation: 5,
        shadowColor: 'black',
        shadowOpacity: 0.2,
        shadowOffset: { height: 3, width: 3 },
        shadowRadius: 5,
    },
    paymentButton: {
        padding: 15,
        marginHorizontal: 15,
        marginVertical: 10,
        borderRadius: 15,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { height: 2, width: 2 },
        shadowRadius: 4,
    },
    
    FlatListCont: {
        marginBottom: 20,
    }
    
});

export default UserCartScreen;


