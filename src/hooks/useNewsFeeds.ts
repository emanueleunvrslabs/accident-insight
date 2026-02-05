import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { NewsFeed } from '@/types/incident';

export function useNewsFeeds() {
  return useQuery({
    queryKey: ['news-feeds'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('news_feeds')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as unknown as NewsFeed[];
    },
  });
}

export function useAddNewsFeed() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (feed: { name: string; feed_url: string; feed_type?: string }) => {
      const { data, error } = await supabase
        .from('news_feeds')
        .insert({
          name: feed.name,
          feed_url: feed.feed_url,
          feed_type: feed.feed_type || 'web',
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news-feeds'] });
    },
  });
}

export function useToggleNewsFeed() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from('news_feeds')
        .update({ is_active })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news-feeds'] });
    },
  });
}

export function useDeleteNewsFeed() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('news_feeds')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news-feeds'] });
    },
  });
}
