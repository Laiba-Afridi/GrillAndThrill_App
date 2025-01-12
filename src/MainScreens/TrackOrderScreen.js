import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { firebase } from '../Firebase/FirebaseConfig'
import { AuthContext } from '../Context/AuthContext'
import TrackOrderItems from '../Components/TrackOrderItems'


const TrackOrderScreen = ({navigation}) => {
  const { userloggeduid, } = useContext(AuthContext);

  const [orders, setOrders] = useState([])
  const [foodData, setFoodData] = useState([]);
  const [foodDataAll, setFoodDataAll] = useState([]);



  const getorders = async () => {
    const ordersRef = firebase.firestore().collection('UserOrders').where('userid', '==', userloggeduid);

    ordersRef.onSnapshot(snapshot => {
      setOrders(snapshot.docs.map(doc => doc.data()))
    })
  }
  useEffect(() => {
    getorders()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const foodRef = firebase.firestore().collection('OrderItems');

      foodRef.onSnapshot(snapshot => {
        setFoodData(snapshot.docs.map(doc => doc.data().cartItems))
      }
      )
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const foodRef = firebase.firestore().collection('FoodData');

      foodRef.onSnapshot(snapshot => {
        setFoodDataAll(snapshot.docs.map(doc => doc.data()))
      }
      )
    };

    fetchData();
  }, []);



  return (
    <View style={styles.container}>
      <View style={{ backgroundColor: '#080f17', paddingVertical: 15, paddingHorizontal: 15, marginTop: 30 }}>
      </View>

      <ScrollView>
        <Text style={styles.mainHeading}>My Orders</Text>
        <View style={styles.mainContainer}>
          {
            orders.map((order, index) => {
              return (
                <View key={index}>
                  <Text style={styles.orderId}>Order id : {(order.orderid).substring(0, 15)}</Text>

                  <TrackOrderItems foodDataAll={foodDataAll} data={order.orderid} navigation={navigation} />
        
                  <Text style={styles.orderTotal}>Total : {order.ordercost}</Text>
                </View>
              )
            })

          }

        </View>
      </ScrollView>
    </View>
  )
}

export default TrackOrderScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#ffffe3'
  },
  mainHeading: {
    fontSize: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontWeight: '800',
    color:'#9d0000'
  },

  mainContainer: {
    marginBottom: 10,
    marginHorizontal: 10,
    elevation: 2,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor:'white',

  },
  orderId: {
    fontSize: 16,
    color: 'grey',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: '#d9d9d9',
    paddingVertical: 5
  },
  orderTime: {
    paddingHorizontal: 6,
    paddingVertical: 5
  },
  orderTotal: {
    fontSize: 17,
    textAlign: 'right',
    marginVertical: 5,
    marginRight: 20,
    fontWeight: '600'
  },

  cardimage: {
    width: 90,
    height: 80,
    borderBottomLeftRadius: 20,
    borderTopLeftRadius: 20
  },
  orderItemContainer_2: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',

  },
  orderItemName: {
    fontSize: 16,
    fontWeight: '600'
  },

});