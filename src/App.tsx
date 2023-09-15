import { Github, Wand2 } from 'lucide-react'
import { Button } from './components/ui/button';
import { Separator } from './components/ui/separator';
import { Textarea } from './components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Slider } from './components/ui/slider';
import { VideoInputForm } from './components/video-input-form';
import { PromptSelect } from './components/prompt-select';
import { useState } from 'react';
import { useCompletion } from 'ai/react'

export function App() {

  const [temperature, setTemperature] = useState(0.5)

  const [videoId, setVideoId] = useState<string | null>(null)


  const { 
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    completion,
    isLoading,
  } = useCompletion({
    api: 'http://localhost:3000/ai/complete',
    body: {
      videoId,
      temperature,
    },
    headers: {
      'Content-Type': 'application/json'
    }
  })

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
              value={input}
              onChange={handleInputChange}
            />
            <Textarea
              className='resize-none p-5 leading-relaxed ' 
              placeholder='Resultado gerado pela IA..' 
              disabled
              value={completion}
            />

          </div>
          <p className="text-sm text-muted">
            Lembre-se: você pode utilizar a varíavel <code className="text-orange-400">{'{transcription}'}</code> no seu prompt para adicionar o conteudo da transcrição do vídeo selecionado</p>
        </div>
        <aside className="w-80 space-y-6 ">
          <VideoInputForm onVideoUploaded={setVideoId} />

          <Separator />

          <form onSubmit={handleSubmit}className='space-y-4'>
            <div className="space-y-2">
            
            <label >Prompt</label>
              <PromptSelect onPromptSelected={setInput} />
              
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
                value={[temperature]}
                onValueChange={value => setTemperature(value[0])}
                />

                </div>
                <span className='text-muted-foreground leading-relaxed text-xs'>
                  Valores mais altos tendem a deixar o resultado mais criativo e com possíveis erros
                </span>
            </div>

            <Separator />

            <Button disabled={isLoading} type="submit" className='w-full'>
              Executar
              <Wand2 className="w-4 h-4 ml-2"/>
            </Button>
          </form>
        </aside>
      </main>
    </div>
  )
}


