/* eslint-disable @next/next/no-html-link-for-pages */
// @ts-nocheck
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import base64ToBlob from '@/utils/base64toBlob';
import axios from 'axios';
import { useRouter } from 'next/router';
import useStableDiffusion from '@/services/useStableDiffusion';

const MakeSubmissionModal = ({ openModal, handleOnClose }) => {
  const router = useRouter();
  const { ethereum } = window || {};
  const { id } = router.query;
  const [submissionName, setSubmissionName] = useState('');
  const [submissionDescription, setSubmissionDescription] = useState('');
  const [images, setImages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [base64Image, setBase64Image] = useState(null);
  const [txHash, setTxHash] = useState('');

  const apiKeys = process.env.NEXT_PUBLIC_NFTSTORAGE_TOKEN;

  const pinataApiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
  const pinataSecretApiKey = process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY;
  const pinataEndpoint = 'https://api.pinata.cloud/pinning/pinFileToIPFS';

  const handleGenerateImages = async (e) => {
    e.preventDefault();

    const mintNotification = toast.loading(
      'Generating your Images! Standby...'
    );

    setIsGenerating(true);

    try {
      const data = await useStableDiffusion(submissionDescription, 1);

      if (data && data.artifacts && data.artifacts.length > 0) {
        setBase64Image(data.artifacts[0].base64);

        toast.update(mintNotification, {
          render: 'Image Generation Completed',
          type: 'success',
          isLoading: false,
          autoClose: 7000,
        });
      } else {
        throw new Error('No image data returned');
      }
    } catch (error) {
      console.error('Error generating images:', error);
      toast.update(mintNotification, {
        render: `Error: ${error.message}`,
        type: 'error',
        isLoading: false,
        autoClose: 7000,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const submitSolution = async (e) => {
    e.preventDefault();

    let base64String = base64Image;
    let imageType = 'image/jpeg';
    let blob = base64ToBlob(base64String, imageType);

    try {
      const mintNotification = toast.loading(
        'Please wait! Submitting your entry'
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
        name: submissionName,
        description: submissionDescription,
        image: imageUrl,
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

      toast.update(mintNotification, {
        render: 'Submission Completed Successfully',
        type: 'success',
        isLoading: false,
        autoClose: 7000,
      });
    } catch (error) {
      console.log(error);
    } finally {
      handleOnClose();
    }
  };

  return (
    <>
      <Transition appear show={openModal} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10 font-serif"
          onClose={handleOnClose}
        >
          <Transition.Child
            as={Fragment}
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

            <div className="flex min-h-full  items-center justify-center p-2 text-center pt-6">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-[70%]  transform overflow-hidden rounded-lg pb-3 bg-[#00000091] border border-gray-800  text-left align-middle shadow-xl transition-all">
                  <div className="relative h-[120px] w-full">
                    <img
                      src="/warrior.webp"
                      alt=""
                      className="h-full w-full object-cover"
                    />

                    <div className="absolute top-0 left-0 h-full w-full bg-black opacity-60"></div>
                    <p className="absolute top-[36px] px-[300px]  right-[70px] transform  text-white text-3xl font-bold">
                      Submit an &nbsp;
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 mr-1">
                        Entry
                      </span>
                    </p>
                  </div>
                  <div className="mt-4 pr-10 pl-2 flex w-full text-center justify-center">
                    <div className="w-[100%]">
                      <img
                        src={`data:image/jpeg;base64,${base64Image}`}
                        alt=""
                        className="rounded-xl w-[700px] h-[420px]  object-cover"
                      />
                      <div className="pt-1 text-start text-white"></div>

                      <div>
                        <button
                          className="text-white border-purple-300 border focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-xl text-sm px-8 mt-5 py-2 hover:opacity-70"
                          onClick={handleGenerateImages}
                        >
                          Generate Image
                        </button>
                      </div>
                    </div>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <div className="text-white w-[50%]">
                      <form className="ml-[40px] w-[300px] mt-6">
                        <div className="relative z-0 w-full mb-6 group">
                          <input
                            name="floating"
                            className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-500 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                            placeholder=" "
                            required
                            onChange={(e) => setSubmissionName(e.target.value)}
                          />
                          <label
                            for="floating"
                            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                          >
                            Entry Name
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
                              setSubmissionDescription(e.target.value)
                            }
                          />
                          <label
                            for="floating_repeat"
                            className="peer-focus:font-medium absolute text-sm text-gray-400 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                          >
                            Prompt
                          </label>
                        </div>

                        <button
                          type="submit"
                          className="text-white  bg-gradient-to-r from-purple-700 via-purple-500 to-pink-500 mt-3 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300  rounded-lg text-sm font-bold w-[140px] sm:w-auto px-8 py-2 text-center dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800"
                          onClick={submitSolution}
                        >
                          Submit
                        </button>
                      </form>
                    </div>
                    &nbsp;&nbsp;
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <div className="z-999">
        <ToastContainer />
      </div>
    </>
  );
};

export default MakeSubmissionModal;
