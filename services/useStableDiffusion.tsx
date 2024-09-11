import axios from 'axios';

const useStableDiffusion = async (prompt, options = {}) => {
  const token = process.env.NEXT_PUBLIC_SD_API_KEY;

  const enhancedPrompt = `ultra realistic, highly detailed, 8k resolution, professional photography, masterpiece, ${prompt}`;

  const negativePrompt = `low quality, blurry, distorted, deformed, disfigured, bad anatomy, extra limbs, missing limbs, floating limbs, disconnected limbs, mutated hands and fingers, poorly drawn hands, poorly drawn face, mutation, mutated, ugly, disgusting, amputation, bad proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck, out of frame, cropped, watermark, signature, text, logo, title, cut off, draft, sketches, poor details, inconsistent style, uneven quality, repetitive elements, asymmetrical, stiff pose, amateur, low contrast, flat colors, oversaturated, overexposed, underexposed, grainy, noisy, pixelated, jpeg artifacts, compression artifacts, poorly drawn, sloppy, messy, scribbles, text overlay, covered face, covering face, closed eyes, weird eyes, crossed eyes, strange nose, bent nose, sharp chin, bad shadows, unnatural shadows, harsh lighting, unnatural colors, unrealistic proportions, disproportionate body, unbalanced composition, awkward posing, stiff posture, unnatural curves, exaggerated features, cartoonish, anime-style (unless requested), childish drawing, poor perspective, depth issues, flat background, floating elements, poor integration of elements, inconsistent light sources, missing reflections, incorrect shadows, anatomically incorrect, physicallly impossible, surreal (unless requested), non-sensical, illogical composition, unintended optical illusions, poor framing, cut-off body parts (unless intended), missing essential details, incomplete scenes, unfinished elements, poor resolution, lack of texture, smooth surfaces (unless intended), lack of depth, cardboard cut-out effect, obvious AI artifacts, unnatural patterns, repetitive textures, uncanny valley effect, lifeless eyes, plastic-looking skin, robotic expressions, unnatural hair, poorly defined clothing, floating clothing, gravity-defying elements (unless intended), inconsistent scale, poor color harmony, clashing colors (unless intended), poor use of negative space, cluttered composition (unless intended), lack of focal point, distracting background elements, poor separation of foreground and background, lack of atmospheric perspective, flat lighting, lack of volumetric lighting, unrealistic reflections, incorrect physics, impossible shadows, missing cast shadows, incorrect caustics, poor representation of materials, unconvincing textures, lack of surface details, uniform textures, lack of weathering or wear (unless intended), sterile environments (unless intended), lack of context, nonsensical juxtapositions (unless intended), poor integration of fantasy elements (if applicable), anachronistic elements (unless intended), culturally inconsistent elements, historically inaccurate details (unless intended), scientific inaccuracies (unless intended), mathematical impossibilities, biological impossibilities, architectural impossibilities, engineering impossibilities, poor representation of motion or action, stiff or unnatural movement, lack of implied movement in static scenes, poor representation of wind or other environmental forces, unconvincing particle effects, poor representation of liquids or fluid dynamics, unnatural fire or smoke, poor representation of clouds or atmospheric effects, lack of atmosphere or mood, emotionless scenes (unless intended), lack of story or narrative (if applicable), confusing or contradictory visual elements, mismatched or inconsistent art styles within the image`;

  const generateImage = async () => {
    const payload = {
      prompt: enhancedPrompt,
      negative_prompt: negativePrompt,
      output_format: 'webp',
      ...options,
    };

    try {
      const response = await axios.postForm(
        `https://api.stability.ai/v2beta/stable-image/generate/ultra`,
        axios.toFormData(payload, new FormData()),
        {
          validateStatus: undefined,
          responseType: 'arraybuffer',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'image/*',
          },
        }
      );

      if (response.status === 200) {
        return Buffer.from(response.data).toString('base64');
      } else {
        throw new Error(`${response.status}: ${response.data.toString()}`);
      }
    } catch (error) {
      console.error('Error generating image:', error);
      throw error;
    }
  };

  try {
    const imagePromises = Array.from({ length: 4 }, () => generateImage());
    const images = await Promise.all(imagePromises);

    return {
      artifacts: images.map((base64, index) => ({ id: index, base64 })),
    };
  } catch (error) {
    console.error('Error generating images:', error);
    throw error;
  }
};

export default useStableDiffusion;
