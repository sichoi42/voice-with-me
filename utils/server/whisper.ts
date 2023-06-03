import axios from 'axios';

export const whisperRecognize = async (audioFile: any) => {
  const form = new FormData();
  form.append('file', new Blob([audioFile.buffer]), audioFile.originalname);
  form.append('model', 'whisper-1');
  form.append('temperature', '0');
  form.append('language', 'ko');
  const headers = {
    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    Accept: 'application/json',
  };
  const response = await axios.post(
    'https://api.openai.com/v1/audio/transcriptions',
    form,
    { headers },
  );
  console.log(response.data.text);
  return response.data.text;
};
