import { useState } from 'react';
import { Rss, Plus, Trash2, ExternalLink, Loader2, ToggleLeft, ToggleRight, Globe, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useNewsFeeds, useAddNewsFeed, useToggleNewsFeed, useDeleteNewsFeed } from '@/hooks/useNewsFeeds';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

export function ManageFeedsDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [feedType, setFeedType] = useState('web');
  const { toast } = useToast();

  const { data: feeds, isLoading } = useNewsFeeds();
  const addFeed = useAddNewsFeed();
  const toggleFeed = useToggleNewsFeed();
  const deleteFeed = useDeleteNewsFeed();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !url) {
      toast({
        title: 'Campi obbligatori',
        description: 'Nome e URL sono obbligatori.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await addFeed.mutateAsync({ name, feed_url: url, feed_type: feedType });
      toast({
        title: 'Fonte aggiunta',
        description: 'La fonte di notizie è stata aggiunta con successo.',
      });
      setName('');
      setUrl('');
      setFeedType('web');
    } catch (error) {
      toast({
        title: 'Errore',
        description: error instanceof Error ? error.message : 'Errore durante l\'aggiunta.',
        variant: 'destructive',
      });
    }
  };

  const handleToggle = async (id: string, currentStatus: boolean) => {
    try {
      await toggleFeed.mutateAsync({ id, is_active: !currentStatus });
      toast({
        title: currentStatus ? 'Fonte disattivata' : 'Fonte attivata',
        description: currentStatus
          ? 'La fonte non verrà più monitorata.'
          : 'La fonte verrà monitorata per nuovi incidenti.',
      });
    } catch (error) {
      toast({
        title: 'Errore',
        description: 'Impossibile modificare lo stato della fonte.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    try {
      await deleteFeed.mutateAsync(id);
      toast({
        title: 'Fonte eliminata',
        description: `"${name}" è stata rimossa.`,
      });
    } catch (error) {
      toast({
        title: 'Errore',
        description: 'Impossibile eliminare la fonte.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-1 sm:gap-2 px-2 sm:px-3 h-9 rounded-xl bg-muted/50 hover:bg-muted/80"
        >
          <Rss className="h-4 w-4" />
          <span className="hidden sm:inline">Fonti</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] rounded-2xl glass border-0">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Fonti di notizie
          </DialogTitle>
          <DialogDescription>
            Gestisci le fonti online da monitorare per identificare incidenti stradali.
          </DialogDescription>
        </DialogHeader>

        {/* Add new feed form */}
        <form onSubmit={handleSubmit} className="space-y-4 border-b border-border/50 pb-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs">Nome fonte</Label>
              <Input
                id="name"
                placeholder="es. ANSA Cronaca"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-10 rounded-xl border-0 bg-muted/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type" className="text-xs">Tipo</Label>
              <Select value={feedType} onValueChange={setFeedType}>
                <SelectTrigger className="h-10 rounded-xl border-0 bg-muted/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="web">Sito Web</SelectItem>
                  <SelectItem value="rss">Feed RSS</SelectItem>
                  <SelectItem value="google-news">Google News</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="url" className="text-xs">URL</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://www.ansa.it/cronaca/"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="h-10 rounded-xl border-0 bg-muted/50"
            />
          </div>
          <Button 
            type="submit" 
            disabled={addFeed.isPending} 
            className="w-full h-11 rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
          >
            {addFeed.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Aggiunta in corso...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Aggiungi fonte
              </>
            )}
          </Button>
        </form>

        {/* Existing feeds list */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-muted-foreground flex items-center gap-2">
            <Sparkles className="h-3 w-3" />
            Fonti configurate ({feeds?.length || 0})
          </h4>
          <ScrollArea className="h-[280px] pr-4 scrollbar-glass">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : feeds?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <div className="p-4 rounded-2xl bg-muted/30 inline-block mb-3">
                  <Rss className="h-8 w-8 opacity-50" />
                </div>
                <p className="font-medium">Nessuna fonte configurata</p>
                <p className="text-xs mt-1">Aggiungi la prima fonte sopra</p>
              </div>
            ) : (
              <div className="space-y-2">
                {feeds?.map((feed) => (
                  <div
                    key={feed.id}
                    className="glass-subtle rounded-xl p-3 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm truncate">{feed.name}</span>
                          <Badge 
                            variant="outline" 
                            className="badge-pill text-[10px] bg-primary/10 text-primary border-primary/20"
                          >
                            {feed.feed_type}
                          </Badge>
                          {!feed.is_active && (
                            <Badge variant="outline" className="badge-pill text-[10px] bg-muted/50 text-muted-foreground">
                              Off
                            </Badge>
                          )}
                        </div>
                        <a
                          href={feed.feed_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-muted-foreground hover:text-primary truncate max-w-[280px] flex items-center gap-1"
                        >
                          {feed.feed_url}
                          <ExternalLink className="h-2.5 w-2.5 flex-shrink-0" />
                        </a>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggle(feed.id, feed.is_active)}
                          className="h-8 w-8 rounded-lg hover:bg-muted/50"
                          title={feed.is_active ? 'Disattiva' : 'Attiva'}
                        >
                          {feed.is_active ? (
                            <ToggleRight className="h-5 w-5 text-success" />
                          ) : (
                            <ToggleLeft className="h-5 w-5 text-muted-foreground" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(feed.id, feed.name)}
                          className="h-8 w-8 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
