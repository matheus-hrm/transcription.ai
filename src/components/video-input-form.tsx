import { Separator } from "@radix-ui/react-separator";
import { FileVideo, Upload } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { ChangeEvent, FormEvent, useMemo, useRef, useState } from "react";
import { getFFmpeg } from "@/lib/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { api } from "../lib/axios"

type Status = "waiting" | "converting" | "uploading" | "generating" | "success"

const statusMessages = {
  converting: "Convertendo...",
  generating: "Gerando transcrição...",
  uploading: "Enviando...",
  success: "Sucesso!",
}

interface VideoInputFormProps {
  onVideoUploaded: (id: string) => void
}


export function VideoInputForm(props: VideoInputFormProps) {

  const [videoFile, setVideoFile] = useState< File | (null) >(null)
  const promptInputRef = useRef<HTMLTextAreaElement>(null)
  const [status, setStatus] = useState<Status>("waiting")

  function handleFileSelected(event: ChangeEvent<HTMLInputElement>){
    const { files } = event.currentTarget 

    if(!files) {
      return
    }
    const selectedFile = files[0]

    setVideoFile(selectedFile)    
  }

  async function convertVideoToAudio(video: File) {
    console.log("convertendo video para audio")

    const ffmpeg = await getFFmpeg()

    await ffmpeg.writeFile("input.mp4", await fetchFile(video))

    //ffmpeg.on("log", log => { 
    //  console.log(log)
    //})

    ffmpeg.on ("progress", progress => {
      console.log("Convertendo: " + Math.round(progress.progress * 100) + "%")

    })

    await ffmpeg.exec([
      '-i',
      'input.mp4',
      '-map',
      '0:a',
      '-b:a',
      '20k',
      '-acodec',
      'libmp3lame',
      'output.mp3',
      
    ])

    const data = await ffmpeg.readFile("output.mp3")

    const audioFileBlob = new Blob([data], { type: "audio/mpeg" })
    const audioFile = new File([audioFileBlob], "audio.mp3", { 
      type: "audio/mpeg", 
    }) 

    console.log('Conversão concluída')

    return audioFile
  } 

  async function handleUploadVideo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const prompt = promptInputRef.current?.value
    
    if (!videoFile){
      return
    }

    setStatus("converting")

    const audioFile = await convertVideoToAudio(videoFile)

    const data = new FormData() 

    data.append('file', audioFile)

    setStatus("uploading")

    const response = await api.post('/videos', data)

    const videoId  = response.data.video.id

    setStatus("generating")

    await api.post(`/videos/${videoId}/transcription`, {
      prompt,
    })

    setStatus("success")

    props.onVideoUploaded(videoId) 
  }

  const previewURL = useMemo(() => {
    if (!videoFile){
      return null
    }

    return URL.createObjectURL(videoFile)
  }, [videoFile])


  return (
    <form onSubmit={handleUploadVideo} className=" space-y-6" >
      <label 
        htmlFor="Video"
        className="relative border border-input rounded-md flex flex-col gap-2 items-center justify-center cursor-pointer aspect-video hover:bg-orange-400/30 transition-colors text-sm text-muted-foreground"
      >
        {previewURL ? (
          <video 
            src={previewURL} 
            controls={false} 
            className="pointer-events-none absolut inset-0" 
          />
        ) : (
        <>
          <FileVideo className="w4 h-4"/>
          Upload
        </>
        )}

        <input type="file" id="Video" accept="video/mp4" className="sr-only" onChange={handleFileSelected}/>
      </label>
      
      
      
       
      <Separator />

      <div className="space-y-3">
        <label htmlFor='transcriptionPrompt'>Prompt de transcrição</label>
        <Textarea 
        disabled={status != 'waiting'}
        ref={promptInputRef}
        id="transcriptionPrompt"
        className='h-20 p-3 leading-relaxed resize-none'
        placeholder='Insira palavras chave mencionadas no video separadas por vírgula'
        />
      </div>
      <Button 
      data-success={status === "success"}
      disabled={status !== 'waiting'} 
      type="submit" 
      className="w-full data-[success=true]:bg-emerald-500" >
        {status === "waiting" ? (
          <>
            Carregar Vídeo
            <Upload className="w-4 h-4 ml-2"/>
          </>
        ) : statusMessages[status] }
      </Button>
    </form>
  )
}