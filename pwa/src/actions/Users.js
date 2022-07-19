import React from "react";
import {
  doc,
  getDoc,
  getDocs,
  collection,
} from "firebase/firestore";
import { db } from "../utils/firebase";

const userCollectionRef = collection(db, "users");

export async function getAllUsers(){
  const docs = getDocs(userCollectionRef)
  const data = await docs
  return data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
}