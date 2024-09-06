// @ts-nocheck
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

/**
 * Custom hook to fetch and return the balance of a given Ethereum address.
 * @param {string} address The Ethereum address to fetch the balance for.
 * @returns {string} The balance in SHM.
 */
export const useFetchBalance = (address) => {
  const [balance, setBalance] = useState('');

  useEffect(() => {
    const fetchBalance = async () => {
      if (!address) return;

      const provider = new ethers.providers.JsonRpcProvider(
        'http://18.185.76.64:8080'
      );

      try {
        const balanceBigNumber = await provider.getBalance(address);
        const formattedBalance = ethers.utils.formatEther(balanceBigNumber);
        setBalance(formattedBalance);
      } catch (error) {
        console.error('Error fetching balance:', error);
        setBalance('0.0005');
      }
    };

    fetchBalance();
  }, [address]);

  return balance;
};
