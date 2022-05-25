import { firebaseAuth } from "src/utils/firebase";
import { signInWithEmailAndPassword } from 'firebase/auth'

export const Login = async (email, password) => {
    await signInWithEmailAndPassword(firebaseAuth, email, password)
};
