import { SLICE_SIZE } from '../constant';
import { IChunk } from '../interface/slice';

/**
 * 创建切片数组
 * @param file 文件
 * @param size 切片大小
 * @returns 切片数组
 */
export const createFileChunk = (file: File, size = SLICE_SIZE) => {
  const chunkList: IChunk[] = [];
  let cur = 0;
  while (cur < file.size) {
    chunkList.push({
      file: file.slice(cur, cur + size),
    });
    cur += size;
  }
  return chunkList;
};
