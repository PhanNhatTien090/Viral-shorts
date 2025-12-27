-- Create scripts table for storing user-saved scripts
CREATE TABLE IF NOT EXISTS scripts (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    topic TEXT,
    platform TEXT,
    vibe TEXT,
    hook TEXT NOT NULL,
    script TEXT NOT NULL,
    cta TEXT NOT NULL,
    visual_prompt TEXT,
    analysis JSONB,
    viral_score INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create index for faster user queries
CREATE INDEX IF NOT EXISTS idx_scripts_user_id ON scripts(user_id);
CREATE INDEX IF NOT EXISTS idx_scripts_created_at ON scripts(created_at DESC);

-- Add comment
COMMENT ON TABLE scripts IS 'Stores user-saved viral video scripts';
