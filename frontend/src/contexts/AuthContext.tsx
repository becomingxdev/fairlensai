import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updateProfile,
  getIdToken,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import type { User as FirebaseUser } from "firebase/auth";
import { app } from "../services/firebase.ts";
import api from "../services/api";

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, org: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const token = await getIdToken(firebaseUser);
        localStorage.setItem("token", token);
        setUser(firebaseUser);
      } else {
        localStorage.removeItem("token");
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  const login = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const token = await getIdToken(userCredential.user);
    localStorage.setItem("token", token);
    
    // Sync with backend
    await api.post("/auth/sync", {
      email: userCredential.user.email,
      name: userCredential.user.displayName || "User",
    });
  };

  const register = async (email: string, password: string, name: string, org: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update profile with name
    await updateProfile(userCredential.user, { displayName: name });
    
    const token = await getIdToken(userCredential.user);
    localStorage.setItem("token", token);

    // Sync with backend
    await api.post("/auth/sync", {
      email,
      name,
      organizationName: org
    });
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const token = await getIdToken(userCredential.user);
    localStorage.setItem("token", token);
    
    // Sync with backend
    await api.post("/auth/sync", {
      email: userCredential.user.email,
      name: userCredential.user.displayName || "User",
    });
  };

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
