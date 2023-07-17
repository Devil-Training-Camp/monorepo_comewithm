import express from 'express';
import Multiparty from 'multiparty'
import http from 'http'
import {resolve as pathResolve} from 'path'
import fse from 'fs-extra'

const app = express();
const server = http.createServer(app)


const UPLOAD_DIR = pathResolve(__dirname, ".", "slice")

app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin || '')
    res.setHeader("Access-Control-Allow-Credentials", "true")
    res.setHeader("Access-Control-Allow-Headers", ["Content-Type", "Origin"])
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    res.setHeader("Access-Control-Max-Age", `${20}`)

    if(req.method.toUpperCase() === "OPTIONS") {
        res.send(200)
    } else {
        next()
    }
})

app.use("/upload", function(req, res) {
    const multipart = new Multiparty.Form()
    // 解析FormData对象
    multipart.parse(req, async(err, fields, files) => {
        if(err) return

        const [file] = files.file
        const [fileName] = fields.fileName
        const [chunkName] = fields.chunkName

        const chunkDir = pathResolve(UPLOAD_DIR, `${fileName}-chunks`)
        // 文件夹不存在，创建文件夹
        if(!fse.existsSync(chunkDir)) {
            await fse.mkdirSync(chunkDir)
        }
        // 移动切片到chunkDir
        await fse.move(file.path, `${chunkDir}/${chunkName}`)
        res.end(JSON.stringify({
            code: 200,
            message: 'upload success'
        }))
    })
})

server.listen(3000, () => {
    console.log('starting server, listening on port 3000')
})