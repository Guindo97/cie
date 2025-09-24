// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDbdYu8D08ksCpcGrQ-rJOr4q-nWZ4z-EI",
  authDomain: "cice-edmonton-gallery.firebaseapp.com",
  projectId: "cice-edmonton-gallery",
  storageBucket: "cice-edmonton-gallery.firebasestorage.app",
  messagingSenderId: "923123672490",
  appId: "1:923123672490:web:6d472a780b85e9e46ef7d3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

class FirebaseService {
  // Ajouter une image à la galerie
  static async addImage(imageData) {
    try {
      const docRef = await addDoc(collection(db, "gallery"), {
        ...imageData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      console.log("✅ Image ajoutée à Firebase avec ID:", docRef.id);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error("❌ Erreur ajout image Firebase:", error);
      return { success: false, error: error.message };
    }
  }

  // Récupérer toutes les images de la galerie
  static async getImages() {
    try {
      const querySnapshot = await getDocs(collection(db, "gallery"));
      const images = [];
      querySnapshot.forEach((doc) => {
        images.push({
          id: doc.id,
          ...doc.data()
        });
      });
      console.log("✅ Images récupérées depuis Firebase:", images.length);
      return images;
    } catch (error) {
      console.error("❌ Erreur récupération images Firebase:", error);
      return [];
    }
  }

  // Mettre à jour une image
  static async updateImage(imageId, updateData) {
    try {
      const imageRef = doc(db, "gallery", imageId);
      await updateDoc(imageRef, {
        ...updateData,
        updatedAt: new Date().toISOString()
      });
      console.log("✅ Image mise à jour dans Firebase:", imageId);
      return { success: true };
    } catch (error) {
      console.error("❌ Erreur mise à jour image Firebase:", error);
      return { success: false, error: error.message };
    }
  }

  // Supprimer une image
  static async deleteImage(imageId) {
    try {
      await deleteDoc(doc(db, "gallery", imageId));
      console.log("✅ Image supprimée de Firebase:", imageId);
      return { success: true };
    } catch (error) {
      console.error("❌ Erreur suppression image Firebase:", error);
      return { success: false, error: error.message };
    }
  }
}

export default FirebaseService;
