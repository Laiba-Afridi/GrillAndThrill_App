import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { firebase } from '../Firebase/FirebaseConfig' 

const Categories = ({ setFoodData }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const foodDataQry = firebase.firestore().collection('FoodData');

    useEffect(() => {
    if (selectedCategory) {
      // If a category is selected, fetch food items that match the category
      foodDataQry
        .where('FoodCategory', '==', selectedCategory) 
        .onSnapshot(snapshot => {
          setFoodData(snapshot.docs.map(doc => doc.data())); 
        });
        } 
    else {
      // If no category is selected, fetch all food items
         foodDataQry.onSnapshot(snapshot => {
        setFoodData(snapshot.docs.map(doc => doc.data())); 
      });
       }
     }, [selectedCategory]);



        const handleCategorySelect = (category) => {
       
        setSelectedCategory(selectedCategory === category ? null : category);
         };

      const categories = [
        { name: 'Chicken', color: '#ddfbf3', icon: require('../Images/icon1.png') },
        { name: 'Beef', color: '#f5e5ff', icon: require('../Images/icon2.png') },
        { name: 'Fries', color: '#e5f1ff', icon: require('../Images/icon3.png') },
        { name: 'Deals', color: '#bdf3e4', icon: require('../Images/icon4.png') },
        { name: 'Beverages', color: '#ddfbe4', icon: require('../Images/icon5.png') },
        { name: 'Nuggets', color: '#d4f0fb', icon: require('../Images/icon6.png') },
    ];

    return (
        <View style={styles.container}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {categories.map((category, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.box,
                            { backgroundColor: selectedCategory === category.name ? '#ffcccb' : category.color }, 
                            selectedCategory === category.name && styles.selectedBox, 
                        ]}
                        onPress={() => handleCategorySelect(category.name)}
                    >
                        <Image source={category.icon} style={styles.image} />
                        <Text style={styles.text}>{category.name}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

export default Categories;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        borderRadius: 10,
    },
    image: {
        width: 20,
        height: 20,
    },
    box: {
        flexDirection: 'row',
        marginLeft: 10,
        marginBottom: 15,
        padding: 10,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
    },
    selectedBox: {
        borderWidth: 2,
        borderColor: '#ff0000',
    },
    text: {
        marginLeft: 5,
    },
});