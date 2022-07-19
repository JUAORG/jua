import { signInWithEmailAndPassword } from 'firebase/auth'
import { firebaseAuth } from "../utils/firebase-config"

export const login = async (email, password) => {
    await signInWithEmailAndPassword(firebaseAuth, email, password)
};
