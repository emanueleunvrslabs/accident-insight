import { useState } from 'react';
import { Plus, Link, Loader2, CheckCircle, Sparkles } from 'lucide-react';
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
        <Button 
          size="sm" 
          className="gap-1 sm:gap-2 px-2 sm:px-3 h-9 rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity shadow-glow"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Aggiungi</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] rounded-2xl glass border-0">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Aggiungi articolo
          </DialogTitle>
          <DialogDescription>
            L'AI analizzerà e classificherà automaticamente l'articolo.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="url" className="text-xs">URL articolo *</Label>
              <div className="relative">
                <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="url"
                  type="url"
                  placeholder="https://..."
                  className="pl-10 h-11 rounded-xl border-0 bg-muted/50"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title" className="text-xs">Titolo articolo *</Label>
              <Input
                id="title"
                placeholder="Titolo dell'articolo"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-11 rounded-xl border-0 bg-muted/50"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="source" className="text-xs">Nome fonte</Label>
              <Input
                id="source"
                placeholder="es. ANSA, Il Corriere, La Repubblica..."
                value={sourceName}
                onChange={(e) => setSourceName(e.target.value)}
                className="h-11 rounded-xl border-0 bg-muted/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="snippet" className="text-xs">Testo/estratto (opzionale)</Label>
              <Textarea
                id="snippet"
                placeholder="Copia qui il testo principale dell'articolo..."
                rows={4}
                value={snippet}
                onChange={(e) => setSnippet(e.target.value)}
                className="rounded-xl border-0 bg-muted/50 resize-none"
              />
              <p className="text-[10px] text-muted-foreground">
                Fornire il testo migliora l'accuratezza dell'estrazione dati.
              </p>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => setOpen(false)}
              className="rounded-xl"
            >
              Annulla
            </Button>
            <Button 
              type="submit" 
              disabled={processArticle.isPending}
              className="rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90"
            >
              {processArticle.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Elaborazione...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Elabora
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
