import { StyleSheet, Text, View, StatusBar, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import React, { useContext, useState } from 'react'
import { FontAwesome } from '@expo/vector-icons';
import { firebase } from "../Firebase/FirebaseConfig";
import { AuthContext } from '../Context/AuthContext';

const SignupScreen = ({ navigation }) => {
  const { userloggeduidHandler } = useContext(AuthContext);

    const [firstname, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [contact, setContact] = useState('')
    const [password, setPassword] = useState('')
    const [cpassword, setCPassword] = useState('')

    const checkIfEmailInUse = async (email) => {
      try {
          const methods = await firebase.auth().fetchSignInMethodsForEmail(email);
          if (methods.length > 0) {
              alert('This email is already registered.');
              return true;
          }
          return false;
      } catch (error) {
          console.error('Error checking email:', error);
          return false;
      }
  };
  
  const createAccountHandler = async () => {
      if (!email || !password || !cpassword) {
          alert('Please fill all the fields!');
          return;
      }
  
      if (password !== cpassword) {
          alert('Passwords do not match!');
          return;
      }
  
      const emailInUse = await checkIfEmailInUse(email);
      if (emailInUse) return;  
  
      try {
          const userCredentials = await firebase.auth().createUserWithEmailAndPassword(email, password);
          const uid = userCredentials?.user?.uid;
  
          
          await firebase.firestore().collection('users').doc(uid).set({
              uid: uid,
              email: email,
              firstname: firstname,
              lastName: lastName,
              contact: contact,
              password:password,
              cpassword:cpassword,
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          });
  
          userloggeduidHandler(uid); 
          alert('Account created successfully!');
      } catch (error) {
          console.error('Error creating account:', error.message);
          alert('Failed to create account. Please try again.');
      }
  };

    
return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar backgroundColor={'#080f17'} />
      
      <View style={{ paddingVertical: 12, width: '95%', alignSelf: 'center', marginBottom: 10 }}>
        <Text style={{ alignSelf: 'center', fontSize: 25, fontWeight: '700' }}>Create Account!</Text>
      </View>

      {/* Input Fields */}
      <View style={styles.inputCont}>
        <FontAwesome name="user" size={24} color="grey" style={styles.icon} />
        <TextInput
          placeholder='Enter First Name'
          style={styles.input}
          value={firstname}
          onChangeText={setFirstName}
        />
      </View>

      <View style={styles.inputCont}>
        <FontAwesome name="user" size={24} color="grey" style={styles.icon} />
        <TextInput
          placeholder='Enter Last Name'
          style={styles.input}
          value={lastName}
          onChangeText={setLastName}
        />
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
        <FontAwesome name="phone" size={24} color="grey" style={styles.icon} />
        <TextInput
          placeholder='Enter Phone Number'
          keyboardType='phone-pad'
          style={styles.input}
          value={contact}
          onChangeText={setContact}
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

      <View style={styles.inputCont}>
        <FontAwesome name="lock" size={24} color="grey" style={styles.icon} />
        <TextInput
          placeholder='Confirm Password'
          style={styles.input}
          value={cpassword}
          onChangeText={setCPassword}
          secureTextEntry={true}
        />
      </View>

      <TouchableOpacity style={styles.loginbutton} onPress={() => createAccountHandler()}>
        <Text style={styles.loginbuttonTxt}>Sign up</Text>
      </TouchableOpacity>

      <View style={{ marginTop: 15, width: '95%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ paddingLeft: 10 }}>
          <Text>Already have an account?</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <View style={{
            backgroundColor: '#9d0000',
            borderRadius: 25,
            padding: 10,
            elevation: 2
          }}>
            <Text style={{
              fontSize: 17,
              fontWeight: '600',
              color: 'white',
              alignSelf: 'center',
              paddingHorizontal: 10
            }}>Login</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#ffffe3', 
    padding: 20,
  },
  inputCont: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 30,
    marginBottom: 15,
    backgroundColor: '#fff', 
    width: '95%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  icon: {
    paddingHorizontal: 10,
    color: '#9d0000', 
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingLeft: 5,
  },
  loginbutton: {
    backgroundColor: '#9d0000', 
    borderRadius: 30,
    paddingVertical: 15,
    width: '95%',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#FF3F00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  loginbuttonTxt: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  signupTextCont: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    fontSize: 16,
    color: 'white',
  },
  signupButton: {
    marginLeft: 10,
    backgroundColor: '#9d0000',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 5,
    shadowColor: '#FF3F00',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  signupButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});