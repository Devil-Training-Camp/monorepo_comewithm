import { useState } from 'react';
import { createFileChunk } from '../utils/slice';
import { IUpload } from '../interface/slice';
import { requestMergeFileChunk, requestUploadFile } from '../request';
import { AxiosProgressEvent } from 'axios';

export const useSlice = () => {
  const [files, setFiles] = useState<File>({} as File);
  const [percentage, setPercentage] = useState(0);
  const [chunkList, setChunkList] = useState<IUpload[]>([]);

  // onchange事件
  const onFileChange = (e) => {
    console.log('change: ', e);
    const files = e.target.files[0];
    setFiles(files);
  };

  // onclick 设置切片
  const onUploadFile = (e) => {
    console.log('file: ', files);
    if (!files) {
      return;
    }
    const chunkList = createFileChunk(files);

    const uploadList = chunkList.map(
      ({ file }, index) =>
        ({
          chunk: file,
          hash: `${files.name}_${index}`,
          index,
          percent: 0,
          size: file.size,
        }) as IUpload,
    );
    setChunkList(uploadList);
    // 上传切片
    uploadFileChunk(uploadList);
  };

  // 上传切片
  const uploadFileChunk = async (list: IUpload[]) => {
    const requestList = list
      .map(({ chunk, hash, index }) => {
        const formData = new FormData();
        formData.append('chunk', chunk);
        formData.append('hash', hash);
        formData.append('filename', files.name);
        return {
          formData,
          index,
        };
      })
      .map(({ formData, index }) => {
        return new Promise(async (resolve, reject) => {
          try {
            await requestUploadFile(formData, onUploadProgress(list[index]));
          } catch (error) {
            reject(error);
            return;
          }
          // setPercentage(percentage => percentage + 1)
          resolve(null);
        });
      });
    // 并发请求
    await Promise.all(requestList);
    // 合并切片
    await requestMergeFileChunk(files.name);
  };

  // 切片上传进度条
  const onUploadProgress = (chunk: IUpload) => (e: AxiosProgressEvent) => {
    chunk.percent = (e.loaded / e.total!) * 100;
    const loaded = +((chunk.size * chunk.percent) / files.size).toFixed(2);
    setPercentage((percentage) => percentage + loaded);
  };

  return [onFileChange, onUploadFile, percentage] as const;
};
