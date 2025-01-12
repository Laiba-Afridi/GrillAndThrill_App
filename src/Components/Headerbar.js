import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Modal, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const Headerbar = () => {
    const [isMenuVisible, setMenuVisible] = useState(false);
    const navigation = useNavigation();

    const toggleMenu = () => {
        setMenuVisible(!isMenuVisible);
    };

    const navigateTo = (screen) => {
        toggleMenu();
        navigation.navigate(screen);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.logoContainer}>
                    <Ionicons name="flame" size={24} color="#ffff00" style={{ marginRight: 5 }} />
                    <Text style={styles.title}>GrillAndThrill</Text>
                </View>
                <TouchableOpacity onPress={toggleMenu}>
                    <Ionicons name="menu" size={28} color="#ffff00" />
                </TouchableOpacity>
            </View>

            {/* Menu Modal */}
            <Modal
                visible={isMenuVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={toggleMenu}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.drawer}>
                        {/* Close Button */}
                        <TouchableOpacity style={styles.closeButton} onPress={toggleMenu}>
                            <Ionicons name="close" size={30} color="#fff" />
                        </TouchableOpacity>

                        {/* Menu Options */}
                        <View style={styles.menuContainer}>
                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={() => navigateTo('Home')}
                            >
                                <Text style={styles.menuText}>Home</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={() => navigateTo('Cart')}
                            >
                                <Text style={styles.menuText}>Cart</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={() => navigateTo('Orders')}
                            >
                                <Text style={styles.menuText}>Orders</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={() => navigateTo('Settings')}
                            >
                                <Text style={styles.menuText}>Settings</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default Headerbar;

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: '#080f17',
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#080f17',
        paddingHorizontal: 20,
        paddingVertical: 10,
        height: 60,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffff00',
        letterSpacing: 1,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    drawer: {
        position: 'absolute',
        right: 0,
        top: 0,
        height: height,
        width: '60%',
        backgroundColor: '#080f17',
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
        paddingHorizontal: 15,
    },
    closeButton: {
        alignSelf: 'flex-end',
        marginTop: 50, 
        marginBottom: 30, 
    },
    menuContainer: {
        marginTop: 30, 
    },
    menuItem: {
        paddingVertical: 20, 
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    menuText: {
        fontSize: 18,
        color: '#fff',
    },
});
