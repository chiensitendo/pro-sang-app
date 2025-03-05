import { fireBaseStorage } from "@/firebaseConfig";
import {  ref, deleteObject } from "@firebase/storage";

const deleteImage = async (imageUrl: string) => {
  const imageRef = ref(fireBaseStorage, imageUrl); // Use the appropriate reference

  try {
    await deleteObject(imageRef);
  } catch (error) {
  }
};

export default deleteImage;