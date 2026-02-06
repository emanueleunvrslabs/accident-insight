import { useState } from 'react';
import { Plus, FileText, Rss } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AddArticleDialog } from './incidents/AddArticleDialog';
import { ManageFeedsDialog } from './feeds/ManageFeedsDialog';

export function AddMenu() {
  const [articleOpen, setArticleOpen] = useState(false);
  const [feedsOpen, setFeedsOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            size="sm" 
            className="gap-2 px-3 h-9 rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity shadow-glow"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Aggiungi</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52 rounded-xl bg-popover border border-border shadow-lg z-50">
          <DropdownMenuItem 
            onClick={() => setArticleOpen(true)}
            className="gap-3 py-3 cursor-pointer rounded-lg focus:bg-accent"
          >
            <div className="p-2 rounded-lg bg-primary/10">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <div>
              <div className="font-medium text-foreground">Articolo</div>
              <div className="text-xs text-muted-foreground">Aggiungi un nuovo articolo</div>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setFeedsOpen(true)}
            className="gap-3 py-3 cursor-pointer rounded-lg focus:bg-accent"
          >
            <div className="p-2 rounded-lg bg-accent/10">
              <Rss className="h-4 w-4 text-accent" />
            </div>
            <div>
              <div className="font-medium text-foreground">Fonte</div>
              <div className="text-xs text-muted-foreground">Gestisci le fonti RSS</div>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AddArticleDialog open={articleOpen} onOpenChange={setArticleOpen} />
      <ManageFeedsDialog open={feedsOpen} onOpenChange={setFeedsOpen} />
    </>
  );
}
