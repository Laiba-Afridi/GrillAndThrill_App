import { StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import { FontAwesome } from '@expo/vector-icons';
import { firebase } from '../Firebase/FirebaseConfig'
import { AuthContext } from '../Context/AuthContext';


const LoginScreen = ({ navigation }) => {
  const { userloggeduidHandler } = useContext(AuthContext);

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
   


    const LoginHandler = async () => {
        if (!email || !password) {
            alert('Please fill all the fields!');
            return;
        }
    
        try {
            // Sign in with Firebase Authentication
            const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
            const uid = userCredential.user.uid;
    
            // Retrieve user details from Firestore
            const userDoc = await firebase.firestore().collection('users').doc(uid).get();
    
            if (userDoc.exists) {
                const userData = userDoc.data();
                userloggeduidHandler(uid);
                alert('Login successful!');
    
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'HomeScreen' }],
                });
    
            } else {
                alert('User details not found. Please Sign Up.');
            }
        } catch (error) {
            console.error('Error during login:', error.message);
    
            // Handle Firebase Authentication errors
            if (error.code === 'auth/user-not-found') {
                alert('User not found. Please check your email or sign up.');
            } else if (error.code === 'auth/wrong-password') {
                alert('Incorrect password. Please try again.');
            } else {
                alert('Login failed. Please try again later.');
            }
        }
    };
    
    

    return (
      
        <View style={styles.container}>
            <StatusBar backgroundColor={'#080f17'} />
            <View style={{ paddingVertical: 12, width: '95%', alignSelf: 'center', marginBottom: 10 }}>
                <Text style={{ alignSelf: 'center', fontSize: 25, fontWeight: '700', }} >Welcome Back, Sign In</Text>
            </View>

            <View style={styles.inputCont}>
                <FontAwesome name="user" size={24} color="grey" style={styles.icon} />
                <TextInput
                    placeholder='Email'
                    keyboardType='email-address'
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                />
            </View>

            <View style={styles.inputCont}>
                <FontAwesome name="lock" size={24} color="grey" style={styles.icon} />
                <TextInput
                    placeholder='Password'
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={true}
                />
            </View>
            <TouchableOpacity style={styles.loginbutton} onPress={() => LoginHandler()}>
                <Text style={styles.loginbuttonTxt}>Sign In</Text>
            </TouchableOpacity>

            <View style={{ marginTop: 15, width: '95%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ paddingLeft: 10 }}>
                    <Text>Don't have any account?</Text>
                </View>
                <View style={{
                    backgroundColor: '#9d0000',
                    borderRadius: 25,
                    alignSelf: 'center',
                    padding: 10,
                    elevation: 2
                }} >
                    <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                        <Text style={{
                            fontSize: 17,
                            fontWeight: '600',
                            color: 'white',
                            alignSelf: 'center',
                            paddingHorizontal: 10,
                        }}>Sign up</Text>
                    </TouchableOpacity>
                </View>
            </View>

        </View>

    )
}

export default LoginScreen;


const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffe3', 
        padding: 20,
    },
    inputCont: {
        flexDirection: 'row',
        padding: 10,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 30,
        marginBottom: 15,
        width: '90%',
        alignItems: 'center',
        backgroundColor: '#fff', 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    icon: {
        paddingHorizontal: 10,
        color: '#9d0000', 
    },
    input: {
        flex: 1,
        paddingLeft: 5,
        fontSize: 16,
        color: '#333',
    },
    loginbutton: {
        backgroundColor: '#9d0000', 
        borderRadius: 30,
        width: '90%',
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#FF3F00',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
        marginTop: 10,
    },
    loginbuttonTxt: {
        fontSize: 18,
        fontWeight: '600',
        color: '#ffffe3',
    },
    signupButton: {
        marginLeft: 5,
        backgroundColor: '#9d0000',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 5,
        shadowColor: '#FF3F00',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    signupButtonText: {
        fontSize: 16,
        color: '#080f17',
        fontWeight: '600',
    },
});
