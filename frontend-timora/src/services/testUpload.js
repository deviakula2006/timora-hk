import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

export const testUpload = async (file) => {
  if (!file) return;

  try {
    const storageRef = ref(storage, `test/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    console.log("✅ Uploaded successfully");
    console.log("🔗 File URL:", url);
  } catch (error) {
    console.error("❌ Upload failed:", error);
  }
};
