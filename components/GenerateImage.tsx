import React, { useState, useEffect } from 'react';
import AIModels from './ai-params/AIModels';
import StylePreset from './ai-params/StylePreset';
import Tab from './Tab';
import PromptGeneratorModal from './modals/PromptGeneratorModal';
import axios from 'axios';
import { useImages } from '@/context/ImageContext';
import { ScaleLoader } from 'react-spinners';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useStableDiffusion from '@/services/useStableDiffusion';

interface Artifact {
  base64: string;
}

interface ImageObject {
  id: number;
  base64: string;
}

const GenerateImage = () => {
  const { setImages, setPrompts } = useImages();
  const [editablePromptInput, setEditablePromptInput] = useState<string>('');
  const [receivedPrompt, setReceivedPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);

  const handleOpenModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setOpenModal(true);
  };

  const handleOnClose = () => {
    setOpenModal(false);
  };

  const handleResponse = (prompt: string) => {
    setReceivedPrompt(prompt);
    setPrompts(prompt);
  };

  const handleGenerateImages = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    setIsGenerating(true);

    try {
      const data = await useStableDiffusion(receivedPrompt, 4);

      if (data && data.artifacts) {
        const imageObjects: ImageObject[] = data.artifacts
          .filter((artifact) => artifact.base64)
          .map((artifact, index) => ({ id: index, base64: artifact.base64 }));

        setImages(imageObjects);
        console.log('Image Objects', imageObjects);
      }
    } catch (error) {
      console.error('Error generating images:', error);
      toast.error('Failed to generate images. Try again.', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    setEditablePromptInput(receivedPrompt);
  }, [receivedPrompt]);

  return (
    <div>
      <form className="mx-[150px] ml-[285px] mt-5  relative flex items-center gap-4">
        <div className="mb-3 w-[100%]">
          <label
            htmlFor="success"
            className="block mb-2 text-sm font-medium text-white dark:text-green-500"
          >
            {/* <span className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 font-bold mb-8">
              Image Generation
            </span>
            <br />
            <br /> */}
            <div>
              <span className="text-xl font-bold mt-4">
                Describe your Image
              </span>
              &nbsp;&nbsp;&nbsp;
              <button
                className="border-[1px] border-white/20 text-[12px] font-bold text-gray-400 p-1 rounded-lg animate-bounce"
                onClick={handleOpenModal}
              >
                {' '}
                Prompt Generation
              </button>
            </div>
          </label>
          {/* 
          <FaDiceFive className="text-white text-2xl" /> */}

          <textarea
            // type="text"
            id="success"
            // onChange={handleChange}
            className="bg-[#0b0f172d] border border-gray-500 text-gray-200 dark:text-gray-400 placeholder-gray-700 dark:placeholder-gray-500 text-sm rounded-lg focus:ring-gray-300 focus:border-gray-300 focus:outline-none block w-[100%] p-2.5 dark:bg-gray-700 dark:border-gray-500"
            placeholder="Creating awesomeness"
            value={editablePromptInput}
            onChange={(e) => setEditablePromptInput(e.target.value)}
          />
        </div>

        <div className="text-center w-[80px] mt-[30px]">
          {isGenerating ? (
            <div className="w-[100px]  bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:bg-purple-800 rounded-lg">
              <ScaleLoader
                color="#f0f0f0"
                // size="50px"
                height="40px"
                width="4px"
              />
            </div>
          ) : (
            <button
              type="submit"
              className="text-white  bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300  rounded-lg text-sm font-bold w-[140px] sm:w-auto px-5 py-4 text-center dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800"
              onClick={handleGenerateImages}
            >
              Generate
            </button>
          )}
        </div>
      </form>

      <div className="flex ml-[285px] gap-4">
        <div className=" w-[230px]">
          <AIModels />
        </div>
        <div className=" w-[230px]">
          <StylePreset />
        </div>
        <div className=" w-[230px]">
          <AIModels />
        </div>
      </div>

      <Tab />
      <PromptGeneratorModal
        openModal={openModal}
        handleOnClose={handleOnClose}
        onSendPrompt={handleResponse}
      />

      <ToastContainer />
    </div>
  );
};

export default GenerateImage;
