import { fireBaseDatabase } from "@/firebaseConfig";
import { ref, push, set } from "@firebase/database";

const createImageRecord = async (imageUrl: string, innerKey: string, table: string) => {
    try {
        return new Promise<{default: string, key: any}>((resolve, reject) => {
          // Save URL to Realtime Database
            const newImageRef = push(ref(fireBaseDatabase, table));
            set(newImageRef, { url: imageUrl, innerKey: innerKey, key: newImageRef.key }).then(() => {
                resolve({
                    default: imageUrl,
                    key: newImageRef.key
                });
            }).catch(reject);
        });
      } catch (error) {
        throw error;
      }
};

export default createImageRecord;