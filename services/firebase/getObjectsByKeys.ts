import { fireBaseDatabase } from '@/firebaseConfig';
import { ref, get } from 'firebase/database';

// Function to get multiple objects by keys
async function getObjectsByKeys(keys: string[], table: string): Promise<any[]> {
  const promises = keys.map(key => {
    const dataRef = ref(fireBaseDatabase, `${table}/${key}`);
    return get(dataRef).then(snapshot => snapshot.exists() ? snapshot.val() : null);
  });

  // Wait for all promises to resolve
  return Promise.all(promises);
}

export default getObjectsByKeys;