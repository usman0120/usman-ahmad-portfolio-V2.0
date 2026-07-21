import { db } from '../firebase/firebaseClient';
import { collection, doc, writeBatch } from 'firebase/firestore';

export interface ImportOptions {
  overwriteExisting: boolean;
}

/**
 * Parses a JSON file uploaded by the user.
 */
export const parseJSONFile = (file: File): Promise<any> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result as string;
        const data = JSON.parse(result);
        resolve(data);
      } catch (err) {
        reject(new Error('Invalid JSON file format'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

/**
 * Restores an array of data back to a specific Firestore collection.
 */
export const restoreToFirestore = async (
  collectionName: string, 
  data: any[], 
  options: ImportOptions = { overwriteExisting: true }
) => {
  if (!Array.isArray(data)) {
    throw new Error('Imported data must be an array of documents');
  }

  // Firestore writeBatch has a limit of 500 operations per batch
  const chunkSize = 400; 
  const chunkedData = [];
  
  for (let i = 0; i < data.length; i += chunkSize) {
    chunkedData.push(data.slice(i, i + chunkSize));
  }

  for (const chunk of chunkedData) {
    const batch = writeBatch(db);
    
    for (const item of chunk) {
      if (!item || typeof item !== 'object') continue;
      
      // If the exported item had an 'id' field, we use it to restore the exact document ID
      const docId = item.id;
      const payload = { ...item };
      
      // Remove id from the payload to keep Firestore document clean (the ID is the document key)
      if (payload.id) {
        delete payload.id;
      }
      
      let docRef;
      if (docId) {
        docRef = doc(db, collectionName, docId);
      } else {
        docRef = doc(collection(db, collectionName)); // Generates a new ID
      }

      // If overwriteExisting is true, set() replaces the document completely.
      // If false, merge: true updates existing fields without deleting unmentioned ones.
      batch.set(docRef, payload, { merge: !options.overwriteExisting });
    }
    
    await batch.commit();
  }
};
