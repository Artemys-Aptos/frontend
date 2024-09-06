import { useCallback } from 'react';
import { doc, runTransaction, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';

export const useAddNft = () => {
  const nftCollectionRef = 'nfts';

  const addNFT = useCallback(
    async ({ tokenId, tokenUri, initialSupply, nftPrice }) => {
      const transactionResult = await runTransaction(
        db,
        async (transaction) => {
          const nftDocRef = doc(db, nftCollectionRef, tokenId);

          const nftDoc = await transaction.get(nftDocRef);
          if (nftDoc.exists()) {
            console.log('A record with this tokenId already exists.');
            return false;
          }

          transaction.set(nftDocRef, {
            tokenId,
            tokenUri,
            initialSupply,
            nftPrice,
          });
          return true;
        }
      );

      if (transactionResult) {
        console.log('NFT added successfully.');
      } else {
        console.log('Transaction failed or aborted.');
      }
    },
    []
  );

  return { addNFT };
};
