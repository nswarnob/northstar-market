import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth, firebaseConfigured } from "../config/firebase";
import api from "../services/api";

const AuthContext = createContext(null);

const firebaseMessages = {
  "auth/email-already-in-use": "An account with that email already exists.",
  "auth/invalid-credential": "Invalid email or password.",
  "auth/invalid-email": "Enter a valid email address.",
  "auth/too-many-requests": "Too many attempts. Please try again later.",
  "auth/weak-password": "Choose a stronger password.",
};

function friendlyFirebaseError(error) {
  error.friendlyMessage =
    firebaseMessages[error.code] ||
    error.friendlyMessage ||
    "Authentication failed. Please try again.";
  return error;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(firebaseConfigured);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return undefined;
    }

    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.post("/auth/session");
        setUser(data.data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    });
  }, []);

  const requireFirebase = () => {
    if (!auth) {
      const error = new Error("Firebase is not configured");
      error.friendlyMessage =
        "Firebase Authentication is not configured. Add the VITE_FIREBASE_* variables.";
      throw error;
    }
  };

  const login = async ({ email, password }) => {
    requireFirebase();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const { data } = await api.post("/auth/session");
      setUser(data.data.user);
    } catch (error) {
      throw friendlyFirebaseError(error);
    }
  };

  const register = async ({ name, email, password }) => {
    requireFirebase();
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(credential.user, { displayName: name });
      await credential.user.getIdToken(true);
      const { data } = await api.post("/auth/register", { name });
      setUser(data.data.user);
    } catch (error) {
      throw friendlyFirebaseError(error);
    }
  };

  const logout = async () => {
    if (auth) await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, firebaseConfigured, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

