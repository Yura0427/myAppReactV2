import React, { useContext, useState, useEffect } from "react";
import { auth, firestore } from "../firebase";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  function signup(email, password) {
    return auth
      .createUserWithEmailAndPassword(email, password)
      .then(async (resp) => {
        const userRef = firestore.doc(`users/${resp.user.uid}`);
        const snapshot = userRef.get();
        if (!snapshot.exist) {
          const { email } = resp.user;
          try {
            await userRef.set({
              email,
              photoURL: null,
            });
          } catch (error) {
            console.error(error);
          }
        }
      });
  }

  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password);
  }

  function logout() {
    return auth.signOut();
  }

  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email);
  }

  function updateEmail(email) {
    return currentUser.updateEmail(email).then(async () => {
      const userRef = firestore.doc(`users/${currentUser.uid}`);
      const snapshot = userRef.get();
      if (!snapshot.exist) {
        const { email } = currentUser;
        try {
          await userRef.update({
            email,
          });
        } catch (error) {
          console.error(error);
        }
      }
    });
  }

  function updatePassword(password) {
    return currentUser.updatePassword(password);
  }

  function updateDisplayName(displayName) {
    return currentUser.updateProfile({displayName})
  }

  function updatePhotoURL(photoURL) {
    return currentUser.updateProfile({photoURL})
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
    updateDisplayName,
    updatePhotoURL,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
