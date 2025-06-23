-- Create tables for property management system

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create property_types table
CREATE TABLE IF NOT EXISTS property_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL
);

-- Create sale_types table
CREATE TABLE IF NOT EXISTS sale_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL
);

-- Create features table
CREATE TABLE IF NOT EXISTS features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL
);

-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  price NUMERIC NOT NULL,
  bedrooms INTEGER NOT NULL,
  bathrooms INTEGER NOT NULL,
  square_feet INTEGER NOT NULL,
  description TEXT,
  floor_plan_url TEXT,
  neighborhood TEXT,
  property_type_id UUID NOT NULL REFERENCES property_types(id),
  sale_type_id UUID NOT NULL REFERENCES sale_types(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create property_images table
CREATE TABLE IF NOT EXISTS property_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0
);

-- Create property_features join table
CREATE TABLE IF NOT EXISTS property_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  feature_id UUID NOT NULL REFERENCES features(id) ON DELETE CASCADE
);

-- Add custom fields to auth.users if needed
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Seed property_types
INSERT INTO property_types (name)
VALUES 
  ('house'),
  ('apartment'),
  ('condo'),
  ('land'),
  ('commercial'),
  ('townhouse'),
  ('other')
ON CONFLICT (name) DO NOTHING;

-- Seed sale_types
INSERT INTO sale_types (name)
VALUES 
  ('rent'),
  ('buy')
ON CONFLICT (name) DO NOTHING;

-- Seed features
INSERT INTO features (name)
VALUES 
  ('swimming_pool'),
  ('garden'),
  ('garage'),
  ('air_conditioning'),
  ('gym'),
  ('security')
ON CONFLICT (name) DO NOTHING;