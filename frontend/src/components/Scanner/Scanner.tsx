import { useCallback, useEffect, useRef } from 'react';
import { BrowserMultiFormatReader, Result } from '@zxing/library';
import Webcam from 'react-webcam';

interface Props {
  onUpdate: (arg0: unknown, arg1?: Result) => void;
  onError?: (arg0: string | DOMException) => void;
  width?: number | string;
  height?: number | string;
  facingMode?: ConstrainDOMString;
  delay?: number;
}

const Scanner = ({
  onUpdate,
  onError,
  width = '100%',
  height = '100%',
  facingMode = 'environment',
  delay = 500,
}: Props) => {
  const webcamRef = useRef<Webcam>(null);

  const capture = useCallback(() => {
    const codeReader = new BrowserMultiFormatReader();
    const imageSrc = webcamRef?.current?.getScreenshot();
    if (!imageSrc) return;

    codeReader
      .decodeFromImage(undefined, imageSrc)
      .then(result => onUpdate(null, result))
      .catch(onUpdate);
  }, [onUpdate]);

  useEffect(() => {
    const interval = setInterval(capture, delay);
    return () => clearInterval(interval);
  }, []);

  return (
    <Webcam
      width={width}
      height={height}
      ref={webcamRef}
      screenshotFormat="image/jpeg"
      videoConstraints={{ facingMode }}
      audio={false}
      onUserMediaError={onError}
    />
  );
};

export default Scanner;
