import { StyleSheet, Text, TouchableOpacity, View, Alert, TextInput } from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import { firebase } from '../Firebase/FirebaseConfig'; 
import { AuthContext } from '../Context/AuthContext';

  
const AccountAndSettings = ({ navigation }) => {
    const [userInfo, setUserInfo] = useState(null); 
    const [isEditable, setIsEditable] = useState(false); 
    const [password, setPassword] = useState(''); 
    const { signOut, userloggeduid } = useContext(AuthContext); 

    // Fetch user info from Firebase
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const currentUser = firebase.auth().currentUser;
                if (currentUser) {
                    const userDoc = await firebase.firestore().collection('users').doc(currentUser.uid).get();
                    if (userDoc.exists) {
                        setUserInfo(userDoc.data());
                    } else {
                        console.log('No user data found in Firestore for UID:', currentUser.uid);
                    }
                } else {
                    console.log('No user is logged in.');
                }
            } catch (error) {
                console.error('Error fetching user info:', error.message);
            }
        };
    
        fetchUserInfo();
    }, []);

    // Handle profile update
    const updateProfileHandler = async () => {
        if (!password) {
            Alert.alert('Password Required', 'Please enter your current password to update your profile.');
            return;
        }

        try {
            const currentUser = firebase.auth().currentUser;
            if (currentUser && userInfo) {
                
                const credential = firebase.auth.EmailAuthProvider.credential(
                    currentUser.email,  
                    password  
                );

                await currentUser.reauthenticateWithCredential(credential);

    

                // Update the profile in Firestore
                await firebase.firestore().collection('users').doc(currentUser.uid).update({
                    firstname: userInfo.firstname,
                    lastName: userInfo.lastName,
                    contact: userInfo.contact,
                    email: userInfo.email
                });

                Alert.alert('Profile Updated Successfully!');
                setIsEditable(false); 
                setPassword(''); 
            }
        } catch (error) {
            console.error('Error updating profile:', error.message);
            Alert.alert('Update failed', 'Something went wrong. Please try again later.');
        }
    };

    // Logout handler
    const logoutHandler = async () => {
        try {
            await signOut(); 
            console.log('User logged out');
            navigation.navigate('Login'); 
        } catch (error) {
            console.error('Error logging out:', error.message);
            Alert.alert('Logout failed', 'Something went wrong. Please try again later.');
        }
    };

    return (
        <View style={styles.container}>
         
            <View style={styles.header}>
                <Text style={styles.headerText}>Account and Settings</Text>
            </View>

            {/* Profile Card */}
            <View style={styles.profileCard}>
                {userInfo ? (
                    <>
                        <TextInput
                            style={styles.inputField}
                            value={userInfo.firstname}
                            editable={isEditable}
                            placeholder="First Name"
                            onChangeText={(text) => setUserInfo({ ...userInfo, firstname: text })}
                        />
                        <TextInput
                            style={styles.inputField}
                            value={userInfo.lastName}
                            editable={isEditable}
                            placeholder="Last Name"
                            onChangeText={(text) => setUserInfo({ ...userInfo, lastName: text })}
                        />
                        <TextInput
                            style={styles.inputField}
                            value={userInfo.contact}
                            editable={isEditable}
                            placeholder="Number"
                            onChangeText={(text) => setUserInfo({ ...userInfo, contact: text })}
                        />
                   
                        <TextInput
                         style={styles.inputField}
                         value={userInfo.email}
                         editable={false} 
                         placeholder="Email"
                     />


                        {/* Password Field for Reauthentication */}
                        {isEditable && (
                            <TextInput
                                style={styles.inputField}
                                placeholder="Enter Your Current Password"
                                secureTextEntry={true}
                                value={password}
                                onChangeText={setPassword}
                            />
                        )}
                    </>
                ) : (
                    <Text style={styles.loadingText}>Loading user information...</Text>
                )}
            </View>

            {/* Edit Profile Button */}
            {isEditable ? (
                <TouchableOpacity style={styles.button} onPress={updateProfileHandler}>
                    <Text style={styles.buttonText}>Update Profile</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity style={styles.button} onPress={() => setIsEditable(true)}>
                    <Text style={styles.buttonText}>Edit Profile</Text>
                </TouchableOpacity>
            )}

            {/* Logout Button */}
            <TouchableOpacity style={styles.button} onPress={logoutHandler}>
                <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

export default AccountAndSettings;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffe3',
        justifyContent: 'space-between',  
    },
    header: {
        backgroundColor: '#9d0000',
        paddingVertical: 15,
        paddingHorizontal: 20, 
        marginTop: 30, 
        elevation: 3,
    },
    headerText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    profileCard: {
        margin: 20,
        padding: 20,
        backgroundColor: '#FFF',
        borderRadius: 15,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },
    inputField: {
        fontSize: 16,
        color: '#333',
        backgroundColor: '#F9F9F9',
        padding: 10,
        borderRadius: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#DDD',
    },
    loadingText: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#9d0000',
        borderRadius: 30,
        paddingVertical: 15,
        paddingHorizontal: 40,
        alignSelf: 'center',
        marginBottom: 30, 
    },
    
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
