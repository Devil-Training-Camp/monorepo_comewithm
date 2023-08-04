import { FC } from 'react';
import { IProgressBarProps } from '../../interface/slice';

export const ProgressBar: FC<IProgressBarProps> = (props) => {
  const { value } = props;

  return (
    <>
      <label>上传进度：</label>
      <progress className='progress-bar' max={100} value={value} />
    </>
  );
};
