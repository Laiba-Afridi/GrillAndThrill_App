import { StyleSheet, Text, TouchableOpacity, View, Image, FlatList, SafeAreaView, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState } from 'react';
import Categories from './Categories';

const CardSlider = ({ navigation }) => {
    const [foodData, setFoodData] = useState([]); 
    const [searchQuery, setSearchQuery] = useState(''); 
    const [filteredData, setFilteredData] = useState([]); 

    const openProductHandler = (item) => {
        navigation.navigate('ProductScreen', item); 
    };

    const handleSearch = (query) => {
        setSearchQuery(query);

        // Filter food data based on the search query
        const filtered = foodData.filter(item => 
            item.FoodName.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredData(filtered); 
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.container}>
                    <Categories setFoodData={setFoodData} />
                    
                    {/* Enhanced Search Field */}
                    <View style={styles.searchContainer}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search food..."
                            value={searchQuery}
                            onChangeText={handleSearch}
                        />
                    </View>

                    <Text style={styles.cardouthead}>Top Shelf Tastes</Text>

                    <SafeAreaView>
                        <FlatList
                            style={styles.flatliststyle}
                            showsVerticalScrollIndicator={false} 
                            data={filteredData.length > 0 ? filteredData : foodData} 
                            keyExtractor={(item, index) => index.toString()} 
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    key={item.index}
                                    style={styles.card}
                                    onPress={() => openProductHandler(item)}
                                >
                                    <View>
                                        <Image source={{ uri: item.FoodImageUrl }} style={styles.cardimage} />
                                    </View>
                                    <View style={styles.cardin1}>
                                        <Text style={styles.cardin1txt}>{item.FoodName}</Text>
                                        <View style={styles.cardin2}>
                                            <Text style={styles.cardin2txt1}>{item.FoodCategory}</Text>
                                            <Text style={styles.cardin2txt1}>
                                                Price: <Text>{item.FoodPrice} Rs</Text>
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )}
                            contentContainerStyle={{
                                paddingBottom: 90, 
                            }}
                        />
                    </SafeAreaView>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default CardSlider;

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        marginVertical: 10,
        paddingHorizontal: 5,
    },
    flatliststyle: {
        flexGrow: 1, 
    },
    cardouthead: {
        fontSize: 25,
        fontWeight: '800',
        marginHorizontal: 10,
        paddingLeft: 5,
        color: '#9d0000',
    },
    cardimage: {
        width: '100%',
        height: 150,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    card: {
        width: 320,
        height: 200,
        marginLeft: 15,
        marginTop: 10,
        borderRadius: 17,
        backgroundColor: '#f9e5e5',
    },
    cardin1: {
        marginHorizontal: 3,
        marginTop: 3,
    },
    cardin1txt: {
        fontSize: 17 ,
        fontWeight: '800',
        marginHorizontal: 5,
        color:'#9d0000'
    },
    cardin2: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 6,
    },
    cardin2txt1: {
        fontSize: 12,
        marginRight: 10,
        fontWeight: '500',
    },
    searchContainer: {
        marginVertical: 2,
        marginBottom:15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4,
        backgroundColor: '#fff',
        borderRadius: 10,
        width: '95%', 
        alignSelf: 'center', 
    },
    
    searchInput: {
        height: 45,
        borderRadius: 10,
        paddingLeft: 15,
        fontSize: 16,
        backgroundColor: '#f8f8f8',
    },
});

