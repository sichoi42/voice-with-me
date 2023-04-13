import { FC, MutableRefObject, useRef, useState } from 'react';
import { IconMicrophone, IconPlayerStop } from '@tabler/icons-react';

interface VoiceChatProps {
  onSendAudio: (audioFile: FormData) => void;
  mikeRef: MutableRefObject<HTMLButtonElement | null>;
}

export const VoiceChat: FC<VoiceChatProps> = ({ onSendAudio, mikeRef }) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const speakMessage = (content: string, rate: number) => {
    const utterance = new SpeechSynthesisUtterance(content);
    utterance.lang = 'ko-KR';
    utterance.rate = rate;
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
  };

  const mouseOverMessage =
    '음성으로 질문하시려면 클릭하시고, 녹음을 완료하시려면 한 번 더 클릭해주세요.';

  const startRecordingMessage = '녹음을 시작합니다.';
  const stopRecordingMessage = '녹음을 종료합니다.';

  const focusMessage =
    '음성으로 질문하시려면 엔터를 입력하시고, 녹음을 완료하시려면 한 번 입력해주세요.';

  const audioChunks: BlobPart[] = [];

  const handleStartRecording = async () => {
    if (!isRecording) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunks, { type: 'audio/mp3' });
        audioChunks.splice(0);

        const formData = new FormData();
        formData.append('audio', blob, 'recording.mp3');
        onSendAudio(formData);
      };
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    }
  };

  const handleStopRecording = async () => {
    if (isRecording && mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="voice-chat-container">
      {!isRecording ? (
        <button
          className="start-recording-button"
          ref={mikeRef}
          // 마우스 오버나 클릭 시, 메시지를 음성으로 읽어줌
          onMouseOver={() => {
            speakMessage(mouseOverMessage, 1);
          }}
          onFocus={() => {
            speakMessage(focusMessage, 1);
          }}
          onMouseLeave={stopSpeaking}
          onBlur={stopSpeaking}
          onClick={() => {
            stopSpeaking();
            speakMessage(startRecordingMessage, 1);
            setTimeout(() => {
              handleStartRecording();
            }, 2000);
          }}
          onTouchEnd={(event) => {
            stopSpeaking();
            speakMessage(startRecordingMessage, 1);
            setTimeout(() => {
              handleStartRecording();
            }, 2000);
            event.preventDefault();
          }}
        >
          <IconMicrophone size={64} />
        </button>
      ) : (
        <button
          className="stop-recording-button"
          ref={mikeRef}
          onClick={() => {
            stopSpeaking();
            speakMessage(stopRecordingMessage, 1);
            setTimeout(() => {
              handleStopRecording();
            }, 2000);
          }}
          onTouchEnd={(event) => {
            stopSpeaking();
            speakMessage(stopRecordingMessage, 1);
            setTimeout(() => {
              handleStopRecording();
            }, 2000);
            event.preventDefault();
          }}
        >
          <IconPlayerStop size={64} />
        </button>
      )}
    </div>
  );
};
