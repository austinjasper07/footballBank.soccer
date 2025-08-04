import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { auth, storage, db } from "../firebase/config";

export async function registerUserWithFile({ email, password, file, displayName }) {
  // Create user
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const uid = userCredential.user.uid;

  // Upload file to Storage
  const fileRef = ref(storage, `user_uploads/${uid}/${file.name}`);
  await uploadBytes(fileRef, file);
  const downloadURL = await getDownloadURL(fileRef);

  // Save user data to Firestore
  const userDoc = doc(db, "users", uid);
  await setDoc(userDoc, {
    uid,
    email,
    displayName,
    fileURL: downloadURL,
    createdAt: new Date(),
  });

  return { uid, downloadURL };
}
