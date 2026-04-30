import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc
} from "firebase/firestore";
import { assertFirebaseReady, db } from "./firebaseClient.js";

function storybookCollection(userId) {
  assertFirebaseReady();
  return collection(db, "users", userId, "storybooks");
}

export async function saveStorybookDraft(userId, storybook) {
  const docRef = await addDoc(storybookCollection(userId), {
    ...storybook,
    ownerId: userId,
    status: "draft",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  return docRef.id;
}

export async function updateStorybookDraft(userId, storybookId, patch) {
  assertFirebaseReady();
  const docRef = doc(db, "users", userId, "storybooks", storybookId);
  await updateDoc(docRef, {
    ...patch,
    updatedAt: serverTimestamp()
  });
}

export async function getStorybookDraft(userId, storybookId) {
  assertFirebaseReady();
  const snapshot = await getDoc(doc(db, "users", userId, "storybooks", storybookId));
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
}

export async function listStorybookDrafts(userId) {
  const snapshot = await getDocs(query(storybookCollection(userId), orderBy("updatedAt", "desc")));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}
