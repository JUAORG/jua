import { signInWithEmailAndPassword } from 'firebase/auth'
import { firebaseAuth } from "../utils/firebase"

export const login = async (email, password) => {
    await signInWithEmailAndPassword(firebaseAuth, email, password)
};
