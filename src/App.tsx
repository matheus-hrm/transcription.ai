import { Github, FileVideo, Upload, Wand2 } from 'lucide-react'
import { Button } from './components/ui/button';
import { Separator } from './components/ui/separator';
import { Textarea } from './components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Slider } from './components/ui/slider';



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
              className='h-20 p-3 leading-relaxed resize-none'
              placeholder='Insira palavras chave mencionadas no video separadas por vírgula'
              />
            </div>
            <Button type="submit" className="w-full" >
              Carregar Vídeo
              <Upload className="w-4 h-4 ml-2"/>
            </Button>
          </form>

          <Separator />

          <form className='space-y-4'>
            <div className="space-y-2">
            <label >Prompt</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um prompt"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Resumo do vídeo">Resumo geral do vídeo</SelectItem>
                  <SelectItem value="Título">Gere um título impactante</SelectItem>
                  <SelectItem value="Perguntas">Crie perguntas que inspirem comentários</SelectItem>
                  <SelectItem value="Tópicos">Divida o vídeo por tópicos</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="space-y-2 pb-3" >
                <label >Modelo</label>
                <Select disabled defaultValue='gpt3.5'>
                  <SelectTrigger>
                    <SelectValue/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt3.5">GPT 3.5</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Separator />

              <div className='space-y-5'>
                <label>Temperatura</label>
                
                <Slider 
                min={0}
                max={1}
                step={0.1}
                defaultValue={[0.5]}
                />

                </div>
                <span className='text-muted-foreground leading-relaxed text-xs'>
                  Valores mais altos tendem a deixar o resultado mais criativo e com possíveis erros
                </span>
            </div>

            <Separator />

            <Button type="submit" className='w-full'>
              Executar
              <Wand2 className="w-4 h-4 ml-2"/>
            </Button>
          </form>
        </aside>
      </main>
    </div>
  )
}


