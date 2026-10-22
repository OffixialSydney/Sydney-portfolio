create extension if not exists pgcrypto;
create table profile(id uuid primary key default gen_random_uuid(), name text, role text, email text, phone text, experience text, skills text[] default '{}', avatar_url text, resume_url text);
create table social_links(id uuid primary key default gen_random_uuid(), github text, linkedin text, twitter text);
create table projects(id uuid primary key default gen_random_uuid(), name text, type text, tech_stack text, logo_url text, link text, sort_order int default 0);
create table experience(id uuid primary key default gen_random_uuid(), period text, title text, bullets text[] default '{}', sort_order int default 0);
create table impact(id uuid primary key default gen_random_uuid(), title text, role text, description text, sort_order int default 0);
create table education(id uuid primary key default gen_random_uuid(), year text, school text, qualification text, sort_order int default 0);

insert into profile(name, role) values ('Sydney', 'Web/Mobile Developer');
insert into social_links(github) values ('');

do $$ declare t text; begin
  foreach t in array array['profile','social_links','projects','experience','impact','education'] loop
    execute format('alter table %I enable row level security', t);
    execute format('create policy "read %1$s" on %1$I for select using (true)', t);
    execute format('create policy "write %1$s" on %1$I for all to authenticated using (true) with check (true)', t);
  end loop;
end $$;

insert into storage.buckets(id, name, public) values ('assets', 'assets', true) on conflict do nothing;
create policy "assets read" on storage.objects for select using (bucket_id = 'assets');
create policy "assets write" on storage.objects for all to authenticated using (bucket_id = 'assets') with check (bucket_id = 'assets');
