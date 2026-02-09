-- ========================================
-- QUESTIONS SYSTEM SCHEMA FOR SUPABASE
-- ========================================
-- Run this in your Supabase SQL Editor

-- ========================================
-- CLEAN START - Drop everything first
-- ========================================
DROP TABLE IF EXISTS user_question_progress CASCADE;
DROP TABLE IF EXISTS user_quiz_attempts CASCADE;
DROP TABLE IF EXISTS short_answers CASCADE;
DROP TABLE IF EXISTS mcq_options CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP VIEW IF EXISTS questions_summary CASCADE;
DROP TYPE IF EXISTS question_type CASCADE;
DROP TYPE IF EXISTS difficulty_level CASCADE;

-- Create enum types
CREATE TYPE question_type AS ENUM ('mcq', 'short_answer');
CREATE TYPE difficulty_level AS ENUM ('easy', 'medium', 'hard');

-- ========================================
-- Table 1: questions
-- ========================================
CREATE TABLE questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question_text TEXT NOT NULL,
  question_type question_type NOT NULL DEFAULT 'mcq',
  category TEXT NOT NULL,
  difficulty difficulty_level NOT NULL DEFAULT 'medium',
  explanation TEXT,
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_by UUID REFERENCES auth.users(id)
);

-- ========================================
-- Table 2: mcq_options
-- ========================================
CREATE TABLE mcq_options (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE NOT NULL,
  option_text TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ========================================
-- Table 3: short_answers
-- ========================================
CREATE TABLE short_answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE NOT NULL,
  correct_answer TEXT NOT NULL,
  alternative_answers TEXT[], -- Array of alternative correct answers
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ========================================
-- Table 4: user_quiz_attempts (for score tracking)
-- ========================================
CREATE TABLE user_quiz_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  category TEXT,
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  score_percentage DECIMAL(5,2),
  time_taken_seconds INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ========================================
-- Table 5: user_question_progress (individual question tracking)
-- ========================================
CREATE TABLE user_question_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE NOT NULL,
  is_correct BOOLEAN,
  user_answer TEXT,
  attempted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, question_id, attempted_at)
);

-- ========================================
-- Indexes for better performance
-- ========================================
CREATE INDEX idx_questions_category ON questions(category);
CREATE INDEX idx_questions_type ON questions(question_type);
CREATE INDEX idx_questions_active ON questions(is_active);
CREATE INDEX idx_questions_order ON questions(order_index);
CREATE INDEX idx_mcq_options_question ON mcq_options(question_id);
CREATE INDEX idx_short_answers_question ON short_answers(question_id);
CREATE INDEX idx_user_quiz_attempts_user ON user_quiz_attempts(user_id);
CREATE INDEX idx_user_quiz_attempts_category ON user_quiz_attempts(category);
CREATE INDEX idx_user_question_progress_user ON user_question_progress(user_id);
CREATE INDEX idx_user_question_progress_question ON user_question_progress(question_id);

-- ========================================
-- Row Level Security (RLS) Policies
-- ========================================

-- Enable RLS on all tables
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mcq_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE short_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_question_progress ENABLE ROW LEVEL SECURITY;

-- Questions Table Policies
CREATE POLICY "Anyone can view active questions" ON questions
  FOR SELECT TO authenticated, anon
  USING (is_active = true);

CREATE POLICY "Authenticated users can view all questions" ON questions
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert questions" ON questions
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update questions" ON questions
  FOR UPDATE TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete questions" ON questions
  FOR DELETE TO authenticated
  USING (true);

-- MCQ Options Table Policies
CREATE POLICY "Anyone can view mcq options for active questions" ON mcq_options
  FOR SELECT TO authenticated, anon
  USING (
    EXISTS (
      SELECT 1 FROM questions
      WHERE questions.id = mcq_options.question_id
      AND questions.is_active = true
    )
  );

CREATE POLICY "Authenticated users can manage mcq options" ON mcq_options
  FOR ALL TO authenticated
  USING (true);

-- Short Answers Table Policies
CREATE POLICY "Authenticated users can view short answers" ON short_answers
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage short answers" ON short_answers
  FOR ALL TO authenticated
  USING (true);

-- User Quiz Attempts Policies
CREATE POLICY "Users can view their own attempts" ON user_quiz_attempts
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own attempts" ON user_quiz_attempts
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can view all attempts" ON user_quiz_attempts
  FOR SELECT TO authenticated
  USING (true);

-- User Question Progress Policies
CREATE POLICY "Users can view their own progress" ON user_question_progress
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" ON user_question_progress
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can view all progress" ON user_question_progress
  FOR SELECT TO authenticated
  USING (true);

-- ========================================
-- Trigger to update updated_at timestamp
-- ========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON questions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- Helper Views for Admin Panel
-- ========================================

-- View: Questions with option counts
CREATE OR REPLACE VIEW questions_summary AS
SELECT 
  q.id,
  q.question_text,
  q.question_type,
  q.category,
  q.difficulty,
  q.is_active,
  q.order_index,
  q.created_at,
  q.updated_at,
  CASE 
    WHEN q.question_type = 'mcq' THEN (SELECT COUNT(*) FROM mcq_options WHERE question_id = q.id)
    ELSE 0
  END as option_count,
  CASE 
    WHEN q.question_type = 'mcq' THEN (SELECT COUNT(*) FROM mcq_options WHERE question_id = q.id AND is_correct = true)
    ELSE 1
  END as correct_answer_count
FROM questions q;

-- ========================================
-- Sample Data (Initial Questions)
-- ========================================

-- Insert sample questions
INSERT INTO questions (question_text, question_type, category, difficulty, order_index) VALUES
('What does PWM stand for?', 'mcq', 'Arduino', 'easy', 1),
('Which microcontroller is based on the ATmega328P chip?', 'mcq', 'Arduino', 'easy', 2),
('How many analog input pins does Arduino Uno have?', 'mcq', 'Arduino', 'easy', 3),
('What is the operating voltage of Arduino Uno?', 'mcq', 'Arduino', 'easy', 4),
('Which protocol uses only 2 wires for communication?', 'mcq', 'IoT', 'medium', 5),
('What is the clock speed of Arduino Uno?', 'mcq', 'Arduino', 'easy', 6);

-- Get the question IDs (you'll need to run these separately after inserting questions)
-- Or use the following approach with DO block:

DO $$
DECLARE
  q1_id UUID;
  q2_id UUID;
  q3_id UUID;
  q4_id UUID;
  q5_id UUID;
  q6_id UUID;
BEGIN
  -- Get question IDs
  SELECT id INTO q1_id FROM questions WHERE question_text = 'What does PWM stand for?';
  SELECT id INTO q2_id FROM questions WHERE question_text = 'Which microcontroller is based on the ATmega328P chip?';
  SELECT id INTO q3_id FROM questions WHERE question_text = 'How many analog input pins does Arduino Uno have?';
  SELECT id INTO q4_id FROM questions WHERE question_text = 'What is the operating voltage of Arduino Uno?';
  SELECT id INTO q5_id FROM questions WHERE question_text = 'Which protocol uses only 2 wires for communication?';
  SELECT id INTO q6_id FROM questions WHERE question_text = 'What is the clock speed of Arduino Uno?';
  
  -- Insert MCQ options for Q1: PWM
  INSERT INTO mcq_options (question_id, option_text, is_correct, order_index) VALUES
  (q1_id, 'Pulse Width Modulation', true, 1),
  (q1_id, 'Power Wave Management', false, 2),
  (q1_id, 'Parallel Wire Mode', false, 3),
  (q1_id, 'Programmable Width Module', false, 4);
  
  -- Insert MCQ options for Q2: Arduino Uno
  INSERT INTO mcq_options (question_id, option_text, is_correct, order_index) VALUES
  (q2_id, 'Arduino Nano', false, 1),
  (q2_id, 'Arduino Uno', true, 2),
  (q2_id, 'Arduino Mega', false, 3),
  (q2_id, 'ESP32', false, 4);
  
  -- Insert MCQ options for Q3: Analog pins
  INSERT INTO mcq_options (question_id, option_text, is_correct, order_index) VALUES
  (q3_id, '4', false, 1),
  (q3_id, '6 (A0-A5)', true, 2),
  (q3_id, '8', false, 3),
  (q3_id, '12', false, 4);
  
  -- Insert MCQ options for Q4: Operating voltage
  INSERT INTO mcq_options (question_id, option_text, is_correct, order_index) VALUES
  (q4_id, '3.3V', false, 1),
  (q4_id, '5V', true, 2),
  (q4_id, '9V', false, 3),
  (q4_id, '12V', false, 4);
  
  -- Insert MCQ options for Q5: Protocol
  INSERT INTO mcq_options (question_id, option_text, is_correct, order_index) VALUES
  (q5_id, 'SPI', false, 1),
  (q5_id, 'I2C', true, 2),
  (q5_id, 'UART', false, 3),
  (q5_id, 'CAN', false, 4);
  
  -- Insert MCQ options for Q6: Clock speed
  INSERT INTO mcq_options (question_id, option_text, is_correct, order_index) VALUES
  (q6_id, '8 MHz', false, 1),
  (q6_id, '16 MHz', true, 2),
  (q6_id, '20 MHz', false, 3),
  (q6_id, '32 MHz', false, 4);
  
END $$;

-- ========================================
-- Success Message
-- ========================================
DO $$
BEGIN
  RAISE NOTICE '✅ Questions System Schema created successfully!';
  RAISE NOTICE '📊 Sample questions inserted!';
  RAISE NOTICE '🔐 RLS policies enabled!';
  RAISE NOTICE '👉 Next: Go to Admin Panel to add more questions';
END $$;
