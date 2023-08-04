export interface IChunk {
  file: Blob;
}

export interface IUpload {
  chunk: Blob;
  hash: string;
  index: number;
  size: number;
  percent: number;
}

export interface IProgressBarProps {
  value: number;
}
