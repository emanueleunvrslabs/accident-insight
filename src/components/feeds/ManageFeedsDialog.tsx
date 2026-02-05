import { useState } from 'react';
import { Rss, Plus, Trash2, ExternalLink, Loader2, ToggleLeft, ToggleRight } from 'lucide-react';
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
        <Button variant="outline" size="sm" className="gap-1 sm:gap-2 px-2 sm:px-4">
          <Rss className="h-4 w-4" />
          <span className="hidden sm:inline">Gestisci fonti</span>
          <span className="sm:hidden">Fonti</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>Fonti di notizie</DialogTitle>
          <DialogDescription>
            Aggiungi e gestisci le fonti online (giornali, RSS, siti web) da monitorare per identificare incidenti stradali.
          </DialogDescription>
        </DialogHeader>

        {/* Add new feed form */}
        <form onSubmit={handleSubmit} className="space-y-4 border-b border-border pb-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome fonte</Label>
              <Input
                id="name"
                placeholder="es. ANSA Cronaca"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select value={feedType} onValueChange={setFeedType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="web">Sito Web</SelectItem>
                  <SelectItem value="rss">Feed RSS</SelectItem>
                  <SelectItem value="google-news">Google News</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://www.ansa.it/cronaca/"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={addFeed.isPending} className="w-full">
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
          <h4 className="text-sm font-medium text-muted-foreground">
            Fonti configurate ({feeds?.length || 0})
          </h4>
          <ScrollArea className="h-[300px] pr-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : feeds?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Rss className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Nessuna fonte configurata</p>
                <p className="text-sm">Aggiungi la prima fonte di notizie sopra</p>
              </div>
            ) : (
              <div className="space-y-2">
                {feeds?.map((feed) => (
                  <div
                    key={feed.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate">{feed.name}</span>
                        <Badge variant={feed.is_active ? 'default' : 'secondary'} className="text-xs">
                          {feed.feed_type}
                        </Badge>
                        {!feed.is_active && (
                          <Badge variant="outline" className="text-xs text-muted-foreground">
                            Disattivato
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <a
                          href={feed.feed_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-muted-foreground hover:text-primary truncate max-w-[300px] flex items-center gap-1"
                        >
                          {feed.feed_url}
                          <ExternalLink className="h-3 w-3 flex-shrink-0" />
                        </a>
                      </div>
                      {feed.last_fetched_at && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Ultimo controllo: {format(new Date(feed.last_fetched_at), "dd MMM yyyy HH:mm", { locale: it })}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggle(feed.id, feed.is_active)}
                        title={feed.is_active ? 'Disattiva' : 'Attiva'}
                      >
                        {feed.is_active ? (
                          <ToggleRight className="h-5 w-5 text-primary" />
                        ) : (
                          <ToggleLeft className="h-5 w-5 text-muted-foreground" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(feed.id, feed.name)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
