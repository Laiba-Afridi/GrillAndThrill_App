import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
    const [userloggeduid, setUserloggeduid] = useState(null);

    const userloggeduidHandler = (userid) => {
        setUserloggeduid(userid);
        AsyncStorage.setItem('userloggeduid', userid);
    };

    const checkIsLogged = async () => {
        try {
            const value = await AsyncStorage.getItem('userloggeduid');
            if (value !== null) {
                console.log('User logged UID retrieved from AsyncStorage:', value);
                setUserloggeduid(value);
            } else {
                console.log('User logged UID not found in AsyncStorage');
            }
        } catch (error) {
            console.log('Error retrieving userloggeduid:', error);
        }
    };

    const signOut = async () => {
        try {
            // Remove user UID from AsyncStorage and clear context
            await AsyncStorage.removeItem('userloggeduid');
            setUserloggeduid(null);
            console.log('User logged out');
        } catch (error) {
            console.log('Error during logout:', error);
            throw new Error('Sign out failed');
        }
    };

    console.log('From Context (UID)', userloggeduid);

    return (
        <AuthContext.Provider value={{ userloggeduid, userloggeduidHandler, checkIsLogged, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthProvider, AuthContext };
