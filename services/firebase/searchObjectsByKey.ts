import { fireBaseDatabase } from '@/firebaseConfig';
import { ref, query, orderByChild, equalTo, get } from '@firebase/database';

async function searchObjectsByKey(keyName: string, value: any, table: string): Promise<any[]> {

  const usersRef = ref(fireBaseDatabase, table);

  // Create a query to filter users by the `age` attribute
  const queryString = query(usersRef, orderByChild(keyName), equalTo(value));

  try {
    const snapshot = await get(queryString);

    if (snapshot.exists()) {
      const data = snapshot.val();
      return data;
    } else {
      return []; // No users found
    }
  } catch (error) {
    return [];
  }
}

export default searchObjectsByKey;
