import { initializeApp } from "firebase/app";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    GoogleAuthProvider,
    signInWithPopup
} from "firebase/auth";
import {
    getFirestore,
    collection,
    query,
    where,
    getDocs,
    addDoc,
    updateDoc,
    doc,
    orderBy,
    limit,
    serverTimestamp,
    deleteDoc,
    writeBatch,
    setDoc,
    getDoc
} from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// ============================================================
// AUTH FUNCTIONS (replaces Appwrite Account)
// ============================================================

/**
 * Sign up a new user with email and password
 */
export const signUpUser = async (email, password, name) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Set display name
    if (name) {
        await updateProfile(userCredential.user, { displayName: name });
    }
    // Store user profile in Firestore
    await setDoc(doc(db, "users", userCredential.user.uid), {
        name: name || "",
        email: email,
        createdAt: serverTimestamp()
    });
    return userCredential.user;
};

/**
 * Sign in an existing user with email and password
 */
export const signInUser = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
};

/**
 * Sign in with Google
 */
export const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    // Check if user profile exists, if not create one
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) {
        await setDoc(userDocRef, {
            name: user.displayName || "",
            email: user.email || "",
            createdAt: serverTimestamp()
        });
    }
    return user;
};

/**
 * Sign out the current user
 */
export const signOutUser = async () => {
    await signOut(auth);
};

/**
 * Subscribe to auth state changes
 */
export const onAuthChange = (callback) => {
    return onAuthStateChanged(auth, callback);
};

// ============================================================
// SEARCH TRACKING FUNCTIONS (replaces Appwrite Database)
// ============================================================

const SEARCH_COLLECTION = "search_metrics";

/**
 * Update search count for a movie search term.
 * If the term exists, increment count. Otherwise create a new document.
 * (Same logic as the original Appwrite updateSearchCount)
 */
export const updateSearchCount = async (searchTerm, movie) => {
    try {
        // 1. Check if the search term exists in the database
        const searchRef = collection(db, SEARCH_COLLECTION);
        const q = query(searchRef, where("searchTerm", "==", searchTerm));
        const querySnapshot = await getDocs(q);

        // 2. If it does, update the count
        if (!querySnapshot.empty) {
            const existingDoc = querySnapshot.docs[0];
            await updateDoc(existingDoc.ref, {
                count: existingDoc.data().count + 1,
            });
        } else {
            // 3. If it doesn't, create a new document with count = 1
            await addDoc(searchRef, {
                searchTerm,
                count: 1,
                movie_id: movie.id,
                poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            });
        }
    } catch (e) {
        console.error("Error updating search count:", e);
    }
};

/**
 * Get the top 5 trending movies based on search count.
 * (Same logic as the original Appwrite getTrendingMovies)
 */
export const getTrendingMovies = async () => {
    try {
        const searchRef = collection(db, SEARCH_COLLECTION);
        const q = query(searchRef, orderBy("count", "desc"), limit(5));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            $id: doc.id,
            ...doc.data()
        }));
    } catch (e) {
        console.error("Error fetching trending movies:", e);
        return [];
    }
};

// ============================================================
// WATCHLIST FUNCTIONS (replaces localStorage with Firestore)
// ============================================================

const WATCHLIST_COLLECTION = "watchlists";

/**
 * Get the user's watchlist from Firestore
 */
export const getUserWatchlist = async (userId) => {
    try {
        const watchlistRef = collection(db, WATCHLIST_COLLECTION, userId, "movies");
        const querySnapshot = await getDocs(watchlistRef);
        return querySnapshot.docs.map(docSnap => ({
            firestoreId: docSnap.id,
            ...docSnap.data()
        }));
    } catch (e) {
        console.error("Error loading watchlist:", e);
        return [];
    }
};

/**
 * Add a movie to the user's watchlist in Firestore
 */
export const addMovieToWatchlist = async (userId, movie) => {
    try {
        const movieData = {
            id: movie.id,
            title: movie.title,
            poster_path: movie.poster_path,
            release_date: movie.release_date,
            vote_average: movie.vote_average,
            overview: movie.overview,
            addedAt: new Date().toISOString()
        };
        // Use movie.id as the document ID so we can easily check / remove
        await setDoc(doc(db, WATCHLIST_COLLECTION, userId, "movies", String(movie.id)), movieData);
        return movieData;
    } catch (e) {
        console.error("Error adding to watchlist:", e);
        throw e;
    }
};

/**
 * Remove a movie from the user's watchlist in Firestore
 */
export const removeMovieFromWatchlist = async (userId, movieId) => {
    try {
        await deleteDoc(doc(db, WATCHLIST_COLLECTION, userId, "movies", String(movieId)));
    } catch (e) {
        console.error("Error removing from watchlist:", e);
        throw e;
    }
};

/**
 * Clear the user's entire watchlist from Firestore
 */
export const clearUserWatchlist = async (userId) => {
    try {
        const watchlistRef = collection(db, WATCHLIST_COLLECTION, userId, "movies");
        const querySnapshot = await getDocs(watchlistRef);
        const batch = writeBatch(db);
        querySnapshot.docs.forEach(d => batch.delete(d.ref));
        await batch.commit();
    } catch (e) {
        console.error("Error clearing watchlist:", e);
        throw e;
    }
};
