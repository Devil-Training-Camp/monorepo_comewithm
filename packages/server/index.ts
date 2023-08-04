import express from 'express';
import Multiparty from 'multiparty';
import http from 'http';
import { resolve as pathResolve } from 'path';
import fse from 'fs-extra';
import { WriteStream } from 'fs';
import { IFormDataName } from './interface/slice';

const app = express();
const server = http.createServer(app);

const UPLOAD_DIR = pathResolve(__dirname, '.', 'slice');

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', ['Content-Type', 'Origin']);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Max-Age', `${20}`);

  if (req.method.toUpperCase() === 'OPTIONS') {
    res.send(200);
  } else {
    next();
  }
});

app.use('/upload', function (req, res) {
  const multipart = new Multiparty.Form();
  // 解析FormData对象
  multipart.parse(req, async (err, fields, files) => {
    if (err) return;
    const [chunk] = files.chunk;
    const [hash] = fields.hash;
    const [filename] = fields.filename;

    const chunkDir = pathResolve(UPLOAD_DIR, `chunks_${filename}`);
    // 文件夹不存在，创建文件夹
    if (!fse.existsSync(chunkDir)) {
      await fse.mkdirSync(chunkDir);
    }
    // 移动切片到chunkDir
    await fse.move(chunk.path, `${chunkDir}/${hash}`);
    res.end('receive chunk');
  });
});

app.use('/merge', async (req, res) => {
  const data = await resolvePost(req);
  const { filename, size } = data as IFormDataName;
  // 切片路径
  const filepath = pathResolve(UPLOAD_DIR, filename);
  await mergeFileChunk(filepath, filename, size);
  res.end(
    JSON.stringify({
      code: 200,
      message: 'file merge successfully',
    }),
  );
});

const resolvePost = (req: any) => {
  return new Promise((resolve) => {
    let chunk = '';
    req.on('data', (data) => {
      chunk += data;
    });

    req.on('end', () => {
      resolve(chunk && JSON.parse(chunk));
    });
  });
};

// 写入文件流
const pipeStream = (path: string, writeStream: WriteStream) => {
  return new Promise((resolve) => {
    const readStream = fse.createReadStream(path);
    readStream.on('end', () => {
      // 读取完之后，删除切片
      fse.unlinkSync(path);
      resolve(null);
    });
    readStream.pipe(writeStream);
  });
};

// 合并切片
const mergeFileChunk = async (filepath: string, filename: string, size: number = 2 * 1024 * 1024) => {
  const chunkDir = pathResolve(UPLOAD_DIR, `chunks_${filename}`);
  let chunkPaths = await fse.readdir(chunkDir);
  // 切片排序
  chunkPaths.sort((a, b) => {
    return +a.split('_')[1] - +b.split('_')[1];
  });

  await Promise.all(
    chunkPaths.map((chunkPath, index) =>
      pipeStream(pathResolve(chunkDir, chunkPath), fse.createWriteStream(filepath, { start: index * size })),
    ),
  );
  // 删除切片文件
  fse.rmdirSync(chunkDir);
};

server.listen(8888, () => {
  console.log('starting server, listening on port 8888');
});
