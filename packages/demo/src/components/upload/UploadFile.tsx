import { useSlice } from '../../hooks/useSlice';
import { ProgressBar } from './ProgressBar';

export const UploadFile = () => {
  const [onFileChange, onUploadFile, percentage] = useSlice();

  return (
    <>
      <input type='file' onChange={onFileChange}></input>
      <ProgressBar value={percentage} />
      <button onClick={onUploadFile}>upload file</button>
    </>
  );
};
