import { Separator } from "@radix-ui/react-separator";
import { FileVideo, Upload } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { ChangeEvent, FormEvent, useMemo, useRef, useState } from "react";
import { getFFmpeg } from "@/lib/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

export function VideoInputForm() {

  const [videoFile, setVideoFile] = useState< File | (null) >(null)
  const promptInputRef = useRef<HTMLTextAreaElement>(null)

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

    const audioFile = await convertVideoToAudio(videoFile)

    console.log(audioFile, prompt) 
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
        ref={promptInputRef}
        id="transcriptionPrompt"
        className='h-20 p-3 leading-relaxed resize-none'
        placeholder='Insira palavras chave mencionadas no video separadas por vírgula'
        />
      </div>
      <Button type="submit" className="w-full" >
        Carregar Vídeo
        <Upload className="w-4 h-4 ml-2"/>
      </Button>
    </form>
  )
}