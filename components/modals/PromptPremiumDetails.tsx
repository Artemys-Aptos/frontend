// @ts-nocheck
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { FaRegCopy, FaWandMagicSparkles } from 'react-icons/fa6';
import { RiCloseCircleLine } from 'react-icons/ri';
import { FiDownload } from 'react-icons/fi';
import { MdOutlineShare, MdOutlineLock } from 'react-icons/md';
import PromptSkeleton from '../skeleton/PromptSkeleton';
import { ethers } from 'ethers';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { decryptPrompt } from '@/utils/encryptPrompt';
import generateKey from '@/utils/generateKey';
import { ClipLoader } from 'react-spinners';
import Link from 'next/link';
import { checkTokenAccess } from '@/utils/checkTokenAccess';
import { formatAddress } from '@/utils/formatAddress';

const PromptPremiumDetails = ({
  openMintModal,
  handleOnClose,
  image,
  name,
  tokenId,
  price,
  tokenPrice,
  prompt,
  creator,
}) => {
  const { ethereum } = window || {};
  const [hasAccess, setHasAccess] = useState(false);
  const [decryptedResponse, setDecryptedResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [buttonText, setButtonText] = useState('Copy Prompt');
  const address = '0x123';
  const [txHash, setTxHash] = useState('');

  // const defaultBalance = useFetchBalance(selectedAccount);
  // console.log('Default Balance:', defaultBalance);

  const handleCopyClick = () => {
    setButtonText('Copied!');
    navigator.clipboard.writeText(prompt);

    setTimeout(() => {
      setButtonText('Copy Prompt');
    }, 3000);
  };

  const handleAccessRequest = async () => {
    setIsLoading(true);

    try {
      const accessResponse = await checkTokenAccess(tokenId, address);

      if (accessResponse === 'Has Access') {
        const decryptionKey = generateKey(name);
        const decryptedPrompt = decryptPrompt(prompt, decryptionKey);
        setDecryptedResponse(decryptedPrompt);
        setHasAccess(true);
      } else {
        setHasAccess(false);
      }
    } catch (error) {
      console.error('Error checking token access:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (openMintModal) {
      handleAccessRequest();
    }
  }, [openMintModal, tokenId]);

  return (
    <>
      <Transition appear show={openMintModal} as={Fragment}>
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

            <div className="flex min-h-full  items-center justify-center p-2 text-center pt-12">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-[70%]  transform overflow-hidden rounded-lg py-3 bg-[#1a1919c5] border border-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                  <div className="mt-4 flex w-full text-center justify-center">
                    <div className="w-[100%]">
                      <img
                        src={image}
                        alt=""
                        className="rounded-xl w-[1024px] h-[800px]  object-cover"
                      />
                      <div className="pt-2 text-start text-white">
                        <div className="pt-1 ml-[10px] w-[100%] text-sm flex justify-center gap-3  ">
                          <span className="p-2 mb-2 border-[4px] rounded-lg border-[#292828] w-[40%] flex items-center justify-center gap-1 cursor-pointer">
                            <FiDownload className="text-lg" />
                            Download
                          </span>
                          <span className="p-2 mb-2 border-[4px] rounded-lg border-[#292828] w-[40%] flex items-center gap-1 cursor-pointer justify-center">
                            <MdOutlineShare className="text-lg" />
                            Share
                          </span>
                        </div>
                      </div>
                    </div>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <div className="text-white w-[100%]">
                      <div className="text-start border-b-[1px] mt-1 border-[#292828]">
                        <h1 className="pb-4 text-xl ml-3">{name}</h1>
                      </div>

                      <div>
                        <RiCloseCircleLine
                          className="text-[37px] absolute right-6 top-7 text-[#555353] cursor-pointer"
                          onClick={handleOnClose}
                        />
                      </div>

                      <div className="flex items-center justify-start py-2 pl-4 border-[4px] border-[#292828] rounded-xl ml-[10px]">
                        <p className="font-bold">Creator :</p>
                        &nbsp;&nbsp;
                        <p className="flex items-center">
                          <img
                            src="/fight.webp"
                            alt=""
                            className="w-[30px] h-[30px] rounded-full object-cover mr-1"
                          />
                          {creator ? formatAddress(creator) : 'user'}
                        </p>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <span className="bg-purple-500 p-[2px] rounded-full text-[16px]  px-3 cursor-pointer hover:opacity-80">
                          Follow
                        </span>
                      </div>

                      <div className="pt-4 text-start">
                        <h4 className="pl-4 text-sm font-bold">
                          Prompt Details
                        </h4>
                        {isLoading ? (
                          <PromptSkeleton />
                        ) : hasAccess ? (
                          <p className="ml-[10px] w-full mt-2 text-sm p-2 rounded-md border-[10px] border-[#292828] text-gray-300">
                            {decryptedResponse}
                          </p>
                        ) : (
                          <div className="relative">
                            <p className="ml-[10px] w-full mt-2 text-sm p-2 rounded-md border-[10px] border-[#292828] text-gray-300 blur-[4px]">
                              Lorem ipsum dolor sit amet, consectetur
                              adipisicing elit. Distinctio, atque adipisci minus
                              eos sint ratione qui laudantium maxime cum fugiat
                              velit itaque facilis quia nobis asperiores ipsam
                              quibusdam eius perspiciatis repellat quam suscipit
                              pariatur. Veritatis rem nisi fuga optio
                              doloremque!
                            </p>
                            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                              <span className="text-gray-300 text-md bg-black bg-opacity-70 p-3 rounded-md flex flex-col justify-center items-center">
                                <MdOutlineLock className="text-lg mb-2" />
                                Buy Prompt NFT to get access
                              </span>
                            </div>
                          </div>
                        )}

                        <div className="pt-2 ml-[10px] w-[100%] text-sm flex justify-center gap-3 border-[10px] border-[#292828] ">
                          <button
                            disabled={!hasAccess}
                            className={`p-2 mb-2 border-[6px] rounded-lg border-[#292828] w-[40%] flex items-center justify-center gap-1 ${
                              !hasAccess
                                ? 'text-stone-500 cursor-not-allowed'
                                : ''
                            }`}
                            onClick={handleCopyClick}
                          >
                            <FaRegCopy className="text-lg" />
                            {buttonText}
                          </button>
                          <button
                            disabled={!hasAccess}
                            className={`p-2 mb-2 border-[6px] rounded-lg border-[#292828] w-[40%] flex items-center gap-1 justify-center ${
                              !hasAccess
                                ? 'text-stone-500 cursor-not-allowed'
                                : ''
                            }`}
                          >
                            <Link
                              href="/generate"
                              className={`flex items-center ${
                                !hasAccess
                                  ? 'text-stone-500 cursor-not-allowed'
                                  : ''
                              }`}
                            >
                              <FaWandMagicSparkles className="text-lg" />
                              Remix
                            </Link>
                          </button>
                        </div>
                      </div>

                      <div className="pt-4 text-start">
                        <h4 className="pl-4 text-sm font-bold">
                          Negative Prompts
                        </h4>
                        {hasAccess && (
                          <p className="ml-[10px] w-full mt-2 text-sm p-2 rounded-md border-[10px] border-[#292828] text-gray-300 ">
                            cartoon, 2d, sketch, drawing, anime, open mouth,
                            nudity, naked, nsfw, helmet, head gear, close up,
                            blurry eyes, two heads, two faces, plastic,
                            Deformed, blurry, bad anatomy, bad eyes, crossed
                            eyes, disfigured, poorly drawn face, mutation,
                            mutated, extra limb, ugly, poorly drawn hands,
                            missing limb, blurry, floating limbs, disconnected
                            limbs, malformed hands, blur, out of focus, long
                            neck, long body, mutated hands and fingers, out of
                            frame, blender, doll, cropped, low-res
                          </p>
                        )}

                        {!hasAccess && (
                          <div className="relative">
                            <p className="ml-[10px] w-full mt-2 text-sm p-2 rounded-md border-[10px] border-[#292828] text-gray-300 blur-[4px]">
                              Lorem ipsum dolor sit amet consectetur adipisicing
                              elit. Eligendi natus totam eius illum qui sapiente
                              ratione a, maxime optio magnam vitae, saepe
                              quaerat consectetur obcaecati quibusdam hic odio.
                              Voluptatibus molestias perferendis iste atque vero
                              quis impedit sint pariatur nobis quasi, aliquid
                              suscipit esse cupiditate. Totam aut velit
                              temporibus porro inventore odio in, placeat eius
                              ad consequuntur illum maiores commodi officia!
                            </p>
                            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                              <span className="text-gray-300 text-md bg-black bg-opacity-70 p-3 rounded-md flex flex-col justify-center items-center">
                                <MdOutlineLock className="text-lg mb-2" />
                                Buy Prompt NFT to get access
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3 mt-6">
                        <div>
                          <h1 className="text-[12px] text-gray-400 text-bold">
                            Input Resolution
                          </h1>
                          <p className="text-[14px] font-bold">1024x1024</p>
                        </div>
                        <div>
                          <h1 className="text-[12px] text-gray-400 text-bold">
                            AI Model
                          </h1>
                          <p className="text-[14px] font-bold">
                            Stable Diffusion XL
                          </p>
                        </div>
                        <div>
                          <h1 className="text-[12px] text-gray-400 text-bold">
                            Chain
                          </h1>
                          <p className="text-[14px] font-bold">Aptos Testnet</p>
                        </div>
                        <div>
                          <h1 className="text-[12px] text-gray-400 text-bold">
                            Preset
                          </h1>
                          <p className="text-[14px] font-bold">neon-punk</p>
                        </div>
                        <div>
                          <h1 className="text-[12px] text-gray-400 text-bold">
                            Current Supply
                          </h1>
                          <p className="text-[14px] font-bold">3000</p>
                        </div>
                        <div>
                          <h1 className="text-[12px] text-gray-400 text-bold">
                            Clip Preset
                          </h1>
                          <p className="text-[14px] font-bold">FAST_BLUE</p>
                        </div>
                      </div>

                      <div className="pt-8 text-start">
                        <div className="pt-2 ml-[10px] w-[100%] text-sm flex justify-center gap-3 border-[10px] border-[#292828] pb-2">
                          {isGenerating ? (
                            <span className="text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-[80%] font-bold px-32 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 rounded-lg sm:w-auto py-4 text-center text-lg cursor-pointer hover:opacity-50">
                              <ClipLoader
                                color="#f0f0f0"
                                size="20px"
                                height="30px"
                                width="3px"
                              />
                            </span>
                          ) : hasAccess ? (
                            <span className="text-white bg-gradient-to-r from-green-500 to-green-700 w-[80%] font-bold px-24 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 rounded-lg sm:w-auto py-4 text-center text-lg">
                              Prompt Bought
                            </span>
                          ) : (
                            <span
                              className="text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-[80%] font-bold px-24 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 rounded-lg sm:w-auto py-4 text-center text-lg cursor-pointer hover:opacity-50"
                              onClick={mintNFT}
                            >
                              Buy for {price} SHM
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    &nbsp;&nbsp;
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <ToastContainer />
    </>
  );
};

export default PromptPremiumDetails;
