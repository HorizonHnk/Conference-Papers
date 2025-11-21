// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, query, where, serverTimestamp } from 'firebase/firestore';

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Auth functions - Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user, error: null };
  } catch (error) {
    console.error('Google sign-in error:', error);
    return { user: null, error: getErrorMessage(error.code) };
  }
};

// Auth functions - Email/Password Sign Up
export const signUpWithEmail = async (email, password, displayName) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    // Update profile with display name
    if (displayName) {
      await updateProfile(result.user, { displayName });
    }
    return { user: result.user, error: null };
  } catch (error) {
    console.error('Email sign-up error:', error);
    return { user: null, error: getErrorMessage(error.code) };
  }
};

// Auth functions - Email/Password Sign In
export const signInWithEmail = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return { user: result.user, error: null };
  } catch (error) {
    console.error('Email sign-in error:', error);
    return { user: null, error: getErrorMessage(error.code) };
  }
};

// Auth functions - Password Reset
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true, error: null };
  } catch (error) {
    console.error('Password reset error:', error);
    return { success: false, error: getErrorMessage(error.code) };
  }
};

// Sign Out
export const logOut = async () => {
  try {
    await signOut(auth);
    return { success: true, error: null };
  } catch (error) {
    console.error('Sign-out error:', error);
    return { success: false, error: error.message };
  }
};

// Auth state listener
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Helper function to get user-friendly error messages
const getErrorMessage = (errorCode) => {
  const errorMessages = {
    'auth/email-already-in-use': 'This email is already registered. Try signing in instead.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/operation-not-allowed': 'This sign-in method is not enabled.',
    'auth/weak-password': 'Password should be at least 6 characters.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'auth/popup-closed-by-user': 'Sign-in was cancelled.',
    'auth/cancelled-popup-request': 'Sign-in was cancelled.',
    'auth/network-request-failed': 'Network error. Please check your connection.',
  };
  return errorMessages[errorCode] || 'An error occurred. Please try again.';
};

// Firestore functions for documents
export const saveDocument = async (userId, documentData) => {
  try {
    const docRef = await addDoc(collection(db, 'papers'), {
      userId,
      title: documentData.title || 'Untitled Document',
      template: documentData.template,
      content: documentData.content,
      userInput: documentData.userInput,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: docRef.id, error: null };
  } catch (error) {
    console.error('Save document error:', error);
    return { id: null, error: error.message };
  }
};

export const getUserDocuments = async (userId) => {
  try {
    // Simple query without orderBy to avoid needing a composite index
    const q = query(
      collection(db, 'papers'),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    const documents = [];
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });
    // Sort client-side by createdAt (newest first)
    documents.sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() || new Date(0);
      const dateB = b.createdAt?.toDate?.() || new Date(0);
      return dateB - dateA;
    });
    return { documents, error: null };
  } catch (error) {
    console.error('Get documents error:', error);
    return { documents: [], error: error.message };
  }
};

export const deleteDocument = async (documentId) => {
  try {
    await deleteDoc(doc(db, 'papers', documentId));
    return { success: true, error: null };
  } catch (error) {
    console.error('Delete document error:', error);
    return { success: false, error: error.message };
  }
};

export default app;
