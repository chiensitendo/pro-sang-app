import { fireBaseDatabase } from "@/firebaseConfig";
import { ref, remove } from "@firebase/database";

const deleteImageRecord = async (key: any, table: string) => {
    try {
        return new Promise((resolve, reject) => {
            remove(ref(fireBaseDatabase, `${table}/${key}`)).then(() => {
                resolve(key);
            }).catch(reject);
        });
      } catch (error) {
        throw error;
      }
};

export default deleteImageRecord;