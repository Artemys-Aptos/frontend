/* eslint-disable @next/next/no-html-link-for-pages */
// @ts-nocheck
import { Dialog, Transition } from '@headlessui/react';
import Link from 'next/link';
import { Fragment, useEffect, useState, useCallback } from 'react';
import DestinationChain from '../ai-params/DestinationChain';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SwitchButton from '../Switch';
import base64ToBlob from '@/utils/base64toBlob';
import { useImages } from '@/context/ImageContext';
import { encryptPrompt } from '@/utils/encryptPrompt';
import generateKey from '@/utils/generateKey';
import axios from 'axios';
import { useNFTCreatedListener } from '@/hooks/useNFTCreatedListener';
import { useAddNft } from '@/hooks/useAddNft';

const CreateNftModal = ({ openModal, handleOnClose, image }) => {
  const { addNFT } = useAddNft();
  const { prompts } = useImages();
  const { ethereum } = window || {};
  const [promptNftName, setPromptNftName] = useState('');
  const [promptNftDescription, setPromptNftDescription] = useState('');
  const [attr, setAttr] = useState(
    JSON.stringify([
      { trait_type: 'model', value: 'Stable Diffusion XL' },
      { trait_type: 'creator', value: '' },
      { trait_type: 'chain', value: '' },
      { trait_type: 'prompts', value: '' },
      { trait_type: 'type', value: '' },
    ])
  );
  const [extUrl, setExtUrl] = useState('https://www.artemis.ai');
  const [maxSupply, setMaxSupply] = useState(3000);
  const [price, setNftPrice] = useState(0);
  const [txHash, setTxHash] = useState('');
  const [isSwitchEnabled, setIsSwitchEnabled] = useState(false);
  const [completedMint, setCompletedMint] = useState(false);

  const pinataApiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
  const pinataSecretApiKey = process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY;
  const pinataEndpoint = 'https://api.pinata.cloud/pinning/pinFileToIPFS';

  const handleModalClose = () => {
    handleOnClose();
    setCompletedMint(false);
  };

  const CreatePromptNFT = async (e) => {
    e.preventDefault();

    if (!ethereum) {
      console.error('Ethereum object not found');
      return;
    }

    let base64String = image;
    let imageType = 'image/jpeg';
    let blob = base64ToBlob(base64String, imageType);

    let promptValue;
    if (isSwitchEnabled) {
      const promptKey = generateKey(promptNftName);
      promptValue = encryptPrompt(prompts, promptKey);
    } else {
      promptValue = prompts;
    }

    let parsedAttr = JSON.parse(attr);
    parsedAttr[3].value = promptValue;
    parsedAttr[2].value = 'Aptos';
    parsedAttr[1].value = address;

    const typeIndex = parsedAttr.findIndex(
      (a: { trait_type: string }) => a.trait_type === 'type'
    );
    if (typeIndex !== -1) {
      parsedAttr[typeIndex].value = isSwitchEnabled ? 'premium' : 'public';
    } else {
      parsedAttr.push({
        trait_type: 'type',
        value: isSwitchEnabled ? 'premium' : 'public',
      });
    }

    setAttr(JSON.stringify(parsedAttr));

    try {
      const mintNotification = toast.loading(
        'Please wait! Tokenizing your Prompt NFT'
      );

      const formData = new FormData();
      formData.append('file', blob);

      const imagePinataResponse = await axios.post(pinataEndpoint, formData, {
        headers: {
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
          pinata_api_key: pinataApiKey,
          pinata_secret_api_key: pinataSecretApiKey,
        },
      });

      if (!imagePinataResponse.data.IpfsHash) {
        throw new Error('Failed to upload image to Pinata');
      }

      const imageUrl = `https://gateway.pinata.cloud/ipfs/${imagePinataResponse.data.IpfsHash}`;

      const metadata = {
        name: promptNftName,
        description: promptNftDescription,
        image: imageUrl,
        attributes: parsedAttr,
      };

      const jsonBlob = new Blob([JSON.stringify(metadata)], {
        type: 'application/json',
      });
      formData.set('file', jsonBlob);
      const metadataPinataResponse = await axios.post(
        pinataEndpoint,
        formData,
        {
          headers: {
            'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
            pinata_api_key: pinataApiKey,
            pinata_secret_api_key: pinataSecretApiKey,
          },
        }
      );

      if (!metadataPinataResponse.data.IpfsHash) {
        throw new Error('Failed to upload metadata to Pinata');
      }

      const metadataUrl = `https://gateway.pinata.cloud/ipfs/${metadataPinataResponse.data.IpfsHash}`;

      const usdPrice = isSwitchEnabled ? price : '0';
      const supply = isSwitchEnabled ? maxSupply : 1;

      toast.update(mintNotification, {
        render: 'Creation Completed Successfully',
        type: 'success',
        isLoading: false,
        autoClose: 7000,
      });

      setPromptNftName('');
      setPromptNftDescription('');
      setMaxSupply('');
      setNftPrice('');
      setCompletedMint(true);
    } catch (error) {
      console.error('Error in the overall NFT creation process:', error);
      toast.error(`Error: ${error.message}`);
    }
  };

  useEffect(() => {
    if (!isSwitchEnabled) {
      setMaxSupply(1);
      setNftPrice(0);
    }
  }, [isSwitchEnabled]);

  return (
    <>
      <Transition appear show={openModal} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10 font-serif"
          onClose={handleOnClose}
        >
          <Transition.Child
            as={'div'}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur"
              aria-hidden="true"
            />

            <div className="flex min-h-full  items-center justify-center p-2 text-center pt-5">
              <Transition.Child
                as={'div'}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                {!completedMint && (
                  <Dialog.Panel className="w-[100%]  transform overflow-hidden rounded-lg bg-black/80 border border-gray-800  text-left align-middle shadow-xl transition-all">
                    <div className="relative h-[100px] w-full">
                      <img
                        src="/abstract.jpg"
                        alt=""
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute top-0 left-0 h-full w-full bg-black opacity-70"></div>
                      <p className="absolute top-[36px] left-[290px] right-8 transform  text-white text-2xl font-bold">
                        Configure{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 ">
                          Prompt Details
                        </span>
                      </p>
                    </div>

                    <div className=" flex w-full text-center justify-center">
                      <div className="w-[100%] mt-3 mb-4 pl-4">
                        <img
                          src={image}
                          alt=""
                          className="rounded-xl w-[530px] h-[550px]  object-cover"
                        />
                      </div>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <div className="text-white w-[100%]">
                        <form className="ml-[40px] w-[400px] mt-6">
                          <div className="relative z-0 w-full mb-6 group">
                            <input
                              name="floating"
                              className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-500 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                              placeholder=" "
                              required
                              onChange={(e) => setPromptNftName(e.target.value)}
                            />
                            <label
                              for="floating"
                              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            >
                              Prompt NFT Name
                            </label>
                          </div>

                          <div className="relative z-0 w-full mb-6 group">
                            <textarea
                              name="text"
                              id="floating_text"
                              className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-500 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                              placeholder=" "
                              required
                              onChange={(e) =>
                                setPromptNftDescription(e.target.value)
                              }
                            />
                            <label
                              for="floating_repeat"
                              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            >
                              Prompt NFT Description (Optional)
                            </label>
                          </div>

                          <div className="flex items-center justify-center z-0 w-full gap-4 mb-6 group">
                            <span
                              htmlFor="floating_repeat"
                              className="text-gray-400 text-[15px]"
                            >
                              Premium Prompt
                            </span>
                            <SwitchButton
                              enabled={isSwitchEnabled}
                              setEnabled={setIsSwitchEnabled}
                            />
                          </div>

                          <div class="text-gray-400 flex justify-center">
                            &nbsp;&nbsp;
                            <DestinationChain />
                          </div>

                          {isSwitchEnabled && (
                            <div class="text-gray-400 flex flex-col items-center mt-6">
                              <label for="quantity" class="block mb-1">
                                Maximum Supply:
                              </label>

                              <input
                                type="number"
                                id="quantity"
                                name="quantity"
                                min="1"
                                max="50000"
                                className="px-4 w-[60%] bg-transparent py-2 border border-gray-500 rounded-md focus:outline-none focus:ring focus:border-purple-600"
                                onChange={(e) => setMaxSupply(e.target.value)}
                              />
                            </div>
                          )}

                          {isSwitchEnabled && (
                            <div className="text-gray-400 mt-6 flex flex-col items-center">
                              <label htmlFor="quantity" className="block mb-1">
                                NFT Price:
                              </label>
                              <input
                                type="number"
                                id="quantity"
                                name="quantity"
                                min="1"
                                step="1"
                                className="px-6 bg-transparent py-2 border border-gray-500 rounded-md focus:outline-none focus:ring focus:border-purple-500"
                                onChange={(e) => setNftPrice(e.target.value)}
                              />
                            </div>
                          )}

                          <button
                            type="submit"
                            className="text-white  bg-gradient-to-r from-purple-700 via-purple-500 to-pink-500 mt-3 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300  rounded-lg text-sm font-bold w-[140px] sm:w-auto px-8 py-2 text-center dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800"
                          >
                            Create
                          </button>
                        </form>
                      </div>
                      &nbsp;&nbsp;
                    </div>
                  </Dialog.Panel>
                )}

                {completedMint && (
                  <Dialog.Panel className="w-full  transform overflow-hidden rounded-lg bg-black/80 border border-gray-800  text-left align-middle shadow-xl transition-all px-32 py-32">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium text-center leading-6 text-gray-300"
                    >
                      Prompt Creation Successful!!
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        You can now proceed to verify your Prompt Transaction on
                        the Explorer.
                        <br /> <br />
                      </p>
                    </div>

                    <div className="mt-4 text-center">
                      <button
                        type="button"
                        className="text-white border-purple-300 border focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-xl text-sm px-4 py-2 hover:opacity-70"
                        //   onClick={closeModal}
                      >
                        <a target="_blank" href={'' + txHash}>
                          Confirm on Aptos
                        </a>
                      </button>
                      &nbsp;&nbsp;&nbsp;
                      <Link href="/home">
                        <button
                          type="button"
                          className="text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-xl text-sm px-4 py-2 hover:opacity-70"
                          //   onClick={closeModal}
                        >
                          View in profile
                        </button>
                      </Link>
                      &nbsp;&nbsp;
                    </div>
                  </Dialog.Panel>
                )}
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <ToastContainer />
    </>
  );
};

export default CreateNftModal;
