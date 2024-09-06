import axios from 'axios';

const useStableDiffusion = async (prompt, numSamples) => {
  const token = process.env.NEXT_PUBLIC_SD_API_KEY; 

  try {
    const response = await axios.post(
      'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
      {
        steps: 40,
        width: 1024,
        height: 1024,
        seed: 0,
        cfg_scale: 5,
        samples: numSamples,
        text_prompts: [
          {
            text: prompt,
            weight: 1,
          },
          {
            text: 'bad anatomy, poorly executed illustrations, disproportionate elements, images extending beyond borders, blank backgrounds, blurry details, body parts out of frame, boring backgrounds, branding, cropped images, cut off elements, deformed features, disfigured aspects, dismemberment, disproportion, distortion, draft-like quality, duplicates, extra body parts (arms, fingers, hands, legs, limbs), faults, flaws, fused fingers, grainy textures, gross proportions, hazy visuals, identifying marks, improper scale, incorrect physiology, incorrect ratios, indistinct appearances, kitsch, logos, long necks, low quality, low resolution, macabre themes, malformed shapes, marks, misshapen aspects, missing body parts, mistakes, morbid elements, mutations, mutilation, off-screen elements, pixelation, poorly drawn faces, hands, or feet, printed words, repellent dimensions, scripts, shortened objects, signs, signatures, split images, squint expressions, storyboards, text, tiling, trimmed images, ugly features, unfocused aspects, unattractive elements, unnatural poses, unsightly elements, and watermarks.',
            weight: -1,
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error generating images:', error);
    throw error;
  }
};

export default useStableDiffusion;
