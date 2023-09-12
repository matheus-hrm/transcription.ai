import { Github, FileVideo, Upload } from 'lucide-react'
import { Button } from './components/ui/button';
import { Separator } from './components/ui/separator';
import { Textarea } from './components/ui/textarea';


export function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className ="px-6 py-3 flex items-center justify-between border-b ">
        <h1 className="text-xl font-bold">transcription.ai</h1>
        
        <div className="flex items-center gap-3">
          <span className='text-sm text-muted-foreground'>
            Feito por matheus-hrm na NLW
          </span>
          
          <Separator orientation="vertical" className="h-6"/>
          
          <Button variant="outline">
            <Github className="w-4 h-4 mr-2" />
              Github 
          </Button>
        </div>
      </div>


      <main className="flex-1 p-6 flex gap-6">
        <div className="flex flex-col flex-1 gap-4">
          <div className="grid grid-rows-2 gap-4 flex-1">
            <Textarea 
              className='resize-none p-5 leading-relaxed'
              placeholder='Insira o prompt para a IA..'
            />
            <Textarea
              className='resize-none p-5 leading-relaxed' 
              placeholder='Resultado gerado pela IA..' 
              readOnly
              disabled
            />

          </div>
          <p className="text-sm text-muted">
            Lembre-se: você pode utilizar a varíavel <code className="text-orange-400">{'{transcription}'}</code> no seu prompt para adicionar o conteudo da transcrição do vídeo selecionado</p>
        </div>
        <aside className="w-80 space-y-6 ">
          <form className=" space-y-6">
            <label 
            htmlFor="video"
            className="border border-input rounded-md flex flex-col gap-2 items-center justify-center cursor-pointer aspect-video hover:bg-orange-400/30 transition-colors text-sm text-muted-foreground"
            >
              <FileVideo className="w4 h-4"/>
              Upload
            </label>
            <input type="file" id="Video" accept="video/mp4" className="sr-only"/>
            
            <Separator />

            <div className="space-y-3">
              <label htmlFor='transcriptionPrompt'>Prompt de transcrição</label>
              <Textarea 
              id="transcriptionPrompt"
              className='h-20 p-5 leading-relaxed resize-none'
              placeholder='Insira palavras chave mencionadas no video separadas por vírgula'
              />
            </div>
            <Button type="submit" className="w-full" >
              Carregar Vídeo
              <Upload className="w-4 h-4 ml-2"/>
            </Button>
          </form>

          <Separator />

          <form className='space-y-2'>
            <label>
              Modelo
            </label>
          </form>
        </aside>
      </main>
    </div>
  )
}


