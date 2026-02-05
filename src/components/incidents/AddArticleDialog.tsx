import { useState } from 'react';
import { Plus, Link, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useProcessArticle } from '@/hooks/useIncidents';

export function AddArticleDialog() {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [snippet, setSnippet] = useState('');
  const [sourceName, setSourceName] = useState('');
  const { toast } = useToast();
  const processArticle = useProcessArticle();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url || !title) {
      toast({
        title: 'Campi obbligatori',
        description: 'URL e titolo sono obbligatori.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const result = await processArticle.mutateAsync({
        article_url: url,
        article_title: title,
        article_snippet: snippet || undefined,
        source_name: sourceName || undefined,
      });

      if (result.processed) {
        toast({
          title: 'Incidente registrato',
          description: result.is_new_incident
            ? 'Nuovo incidente aggiunto alla dashboard.'
            : 'Fonte aggiunta a un incidente esistente.',
        });
      } else {
        toast({
          title: 'Articolo non rilevante',
          description: result.reason || 'L\'articolo non è stato classificato come incidente stradale mortale.',
          variant: 'destructive',
        });
      }

      setOpen(false);
      setUrl('');
      setTitle('');
      setSnippet('');
      setSourceName('');
    } catch (error) {
      toast({
        title: 'Errore',
        description: error instanceof Error ? error.message : 'Errore durante l\'elaborazione.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Aggiungi articolo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Aggiungi articolo manualmente</DialogTitle>
          <DialogDescription>
            Inserisci i dettagli di un articolo su un incidente stradale. L'AI analizzerà e classificherà automaticamente l'articolo.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="url">URL articolo *</Label>
              <div className="relative">
                <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="url"
                  type="url"
                  placeholder="https://..."
                  className="pl-10"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Titolo articolo *</Label>
              <Input
                id="title"
                placeholder="Titolo dell'articolo"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="source">Nome fonte</Label>
              <Input
                id="source"
                placeholder="es. ANSA, Il Corriere, La Repubblica..."
                value={sourceName}
                onChange={(e) => setSourceName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="snippet">Testo/estratto (opzionale)</Label>
              <Textarea
                id="snippet"
                placeholder="Copia qui il testo principale dell'articolo per una migliore analisi..."
                rows={4}
                value={snippet}
                onChange={(e) => setSnippet(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Fornire il testo migliora l'accuratezza dell'estrazione dati.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annulla
            </Button>
            <Button type="submit" disabled={processArticle.isPending}>
              {processArticle.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Elaborazione...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Elabora articolo
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
