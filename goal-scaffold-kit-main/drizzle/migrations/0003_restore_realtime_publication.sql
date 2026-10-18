-- The remixed database lost its live-update list, so notifications and chat no longer arrive live.
do $$
declare t text;
begin
  foreach t in array array['notifications','chat_messages','chat_conversations','agent_presence'] loop
    if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = t) then
      execute format('alter publication supabase_realtime add table public.%I', t);
    end if;
  end loop;
end $$;