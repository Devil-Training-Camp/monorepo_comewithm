import axios, { AxiosProgressEvent } from 'axios';
import { BASE_URL, SLICE_SIZE } from '../constant';

export const request = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});

// 上传文件
export const requestUploadFile = (
  formData: FormData,
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void,
) => {
  return request({
    method: 'post',
    url: 'upload',
    data: formData,
    onUploadProgress,
  });
};

export const requestMergeFileChunk = (filename: string) => {
  return request({
    method: 'post',
    url: 'merge',
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({
      filename,
      size: SLICE_SIZE,
    }),
  });
};
