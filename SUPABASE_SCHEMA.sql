-- SQL script to create tables for contact and quote forms
-- Run this in your Supabase SQL editor

-- Create contacts table
create table contacts (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  first_name text not null,
  last_name text,
  email text not null,
  company text,
  project_type text,
  message text,
  status text default 'new'
);

-- Create quotes table
create table quotes (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  first_name text not null,
  last_name text,
  email text not null,
  company text,
  project_type text,
  project_details text,
  status text default 'new'
);

-- Set up Row Level Security (RLS)
-- This allows anyone to insert but only authenticated users to read/update
alter table contacts enable row level security;
alter table quotes enable row level security;

-- Create policies for contacts
create policy "Anyone can insert contacts" on contacts
  for insert to anon with check (true);

create policy "Admins can read contacts" on contacts
  for select to authenticated using (true);

create policy "Admins can update contacts" on contacts
  for update to authenticated using (true);

-- Create policies for quotes
create policy "Anyone can insert quotes" on quotes
  for insert to anon with check (true);

create policy "Admins can read quotes" on quotes
  for select to authenticated using (true);

create policy "Admins can update quotes" on quotes
  for update to authenticated using (true);

-- Create a trigger to automatically send an email notification when a new contact or quote is submitted
-- (This requires setting up an email integration in Supabase)