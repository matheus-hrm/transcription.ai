import { FFmpeg } from '@ffmpeg/ffmpeg';

import coreURL from '../ffmpeg/ffmpeg-core.js?url';
import workerURL from '../ffmpeg/ffmpeg-worker.js?url';
import wasmURL from '../ffmpeg/ffmpeg-core.wasm?url';

let ffmpeg : FFmpeg | null 

export async function getFFmpeg(){
  if (ffmpeg) return ffmpeg 

  ffmpeg = new FFmpeg()
    
  if (!ffmpeg.loaded) {
    await ffmpeg.load({
      coreURL,
      workerURL,
      wasmURL
    })
  }
  return ffmpeg 
}