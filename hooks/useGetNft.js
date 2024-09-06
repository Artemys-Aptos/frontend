import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase'; 

export const useGetNft = () => {
  const [nfts, setNfts] = useState([]);

  const getNFT = async () => {
    const nftCollectionRef = collection(db, 'nfts');
    try {
      const querySnapshot = await getDocs(nftCollectionRef);
      const nftsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNfts(nftsData);
    } catch (error) {
      console.error('Failed to fetch NFTs: ', error);
    }
  };

  useEffect(() => {
    getNFT();
  }, []);

  return { nfts };
};
