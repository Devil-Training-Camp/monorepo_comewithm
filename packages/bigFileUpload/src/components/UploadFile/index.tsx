import {useState} from 'react';
import axios, {AxiosProgressEvent} from 'axios';

interface FileInfo {
    [key:string]: any
}

export const UploadFile = () => {
    const [files, setFiles] = useState<FileInfo>({})
    const [chunkList, setChunkList] = useState<any[]>([])

    const onFileChange = (e) => {
        const files = e.target.files[0]
        setFiles(files)
        const chunkList = createChunk(files)
        setChunkList(chunkList)
    }

    // 设置切片
    const onUploadFile = (e) => {
        const uploadList = chunkList.map(({file}: {file:FileInfo}, index) => ({
            file,
            size: file.size,
            percent: 0,
            chunkName: `${files.name}_${index}`,
            fileName: files.name,
            index
        }))
        // 上传切片
        uploadFile(uploadList)
    }

    // 上传切片
    const uploadFile = async (list:any[]) => {
        const requestList = list.map(({
            file, fileName, index, chunkName
        }) => {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('fileName', fileName)
            formData.append('chunkName', chunkName)
            return {
                formData,
                index
            }
        }).map(({formData, index}) => {
            return axiosRequest({
                method: 'post',
                url: 'http://127.0.0.1:3000/upload',
                data: formData,
                headers: {},
                onUploadProgress:onUploadProgress(chunkList[index])
            })
        })
    
        await Promise.all(requestList)
    }

    // 上传进度条
    const onUploadProgress = (chunk) => (e: AxiosProgressEvent) => {
        chunk.percent = (e.loaded / (e.total!)) * 100
    }

    return (
        <>
            <input type="file" onChange={onFileChange}></input>
            <button onClick={onUploadFile}>upload file</button>
        </>
    )
}

/**
 * 创建切片数组
 * @param file 文件
 * @param size 切片大小
 * @returns 切片数组
 */
const createChunk = (file: string, size = 2 * 1024 * 1024) => {
    const chunkList:any[] = []
    let cur = 0
    while(cur < size) {
        chunkList.push({
            file: file.slice(cur, cur + size),
        })
        cur += size
    }
    return chunkList
}

/**
 * 接口请求
 * @param param0 
 * @returns 
 */
const axiosRequest = ({
    method = 'post',
    url,
    data,
    headers = {},
    onUploadProgress
}:{
    method:'post' | 'get',
    url:string,
    data:any,
    headers: any,
    onUploadProgress:(progressEvent: AxiosProgressEvent) => void
}) => {
    return new Promise((resolve, reject) => {
        axios[method](url, data, {
            headers:{
                "Content-Type": "application/x-www-form-urlencoded",
                ...headers
            },
            onUploadProgress
        }).then((res) => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}

