/*
  # NurseFlow AI - Core Database Schema

  1. New Tables
    - `profiles` - User profiles with role, hospital, department info
      - `id` (uuid, PK, FK to auth.users)
      - `full_name` (text)
      - `role` (text: nurse, doctor, admin, staff)
      - `hospital_id` (uuid, FK)
      - `department` (text)
      - `avatar_url` (text)
      - `shift_preference` (text: morning, evening, night)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `hospitals` - Multi-hospital support
      - `id` (uuid, PK)
      - `name` (text)
      - `address` (text)
      - `created_at` (timestamptz)

    - `patients` - Patient records
      - `id` (uuid, PK)
      - `hospital_id` (uuid, FK)
      - `full_name` (text)
      - `date_of_birth` (date)
      - `gender` (text)
      - `blood_type` (text)
      - `room_number` (text)
      - `bed_number` (text)
      - `admission_date` (date)
      - `diagnosis` (text)
      - `risk_level` (text: low, medium, high, critical)
      - `attending_doctor_id` (uuid, FK to profiles)
      - `assigned_nurse_id` (uuid, FK to profiles)
      - `status` (text: admitted, discharged, transferred)
      - `created_at` (timestamptz)

    - `patient_vitals` - Real-time vitals monitoring
      - `id` (uuid, PK)
      - `patient_id` (uuid, FK)
      - `heart_rate` (integer)
      - `blood_pressure_systolic` (integer)
      - `blood_pressure_diastolic` (integer)
      - `temperature` (numeric)
      - `oxygen_saturation` (integer)
      - `respiratory_rate` (integer)
      - `recorded_at` (timestamptz)

    - `tasks` - Workflow task management
      - `id` (uuid, PK)
      - `hospital_id` (uuid, FK)
      - `patient_id` (uuid, FK, nullable)
      - `assigned_to` (uuid, FK to profiles)
      - `created_by` (uuid, FK to profiles)
      - `title` (text)
      - `description` (text)
      - `priority` (text: low, medium, high, critical)
      - `status` (text: pending, in_progress, completed, cancelled)
      - `category` (text: medication, care, assessment, procedure, other)
      - `due_date` (timestamptz)
      - `completed_at` (timestamptz, nullable)
      - `created_at` (timestamptz)

    - `medications` - Medication tracking
      - `id` (uuid, PK)
      - `patient_id` (uuid, FK)
      - `prescribed_by` (uuid, FK to profiles)
      - `medicine_name` (text)
      - `dosage` (text)
      - `frequency` (text)
      - `start_date` (date)
      - `end_date` (date, nullable)
      - `instructions` (text)
      - `status` (text: active, completed, discontinued)
      - `created_at` (timestamptz)

    - `medication_logs` - Medication administration records
      - `id` (uuid, PK)
      - `medication_id` (uuid, FK)
      - `administered_by` (uuid, FK to profiles)
      - `administered_at` (timestamptz)
      - `notes` (text)
      - `status` (text: given, skipped, refused)

    - `alerts` - Emergency and notification alerts
      - `id` (uuid, PK)
      - `hospital_id` (uuid, FK)
      - `patient_id` (uuid, FK, nullable)
      - `created_by` (uuid, FK to profiles)
      - `title` (text)
      - `message` (text)
      - `severity` (text: info, warning, urgent, critical)
      - `category` (text: emergency, medication, task, system, patient)
      - `is_resolved` (boolean, default false)
      - `resolved_by` (uuid, FK to profiles, nullable)
      - `resolved_at` (timestamptz, nullable)
      - `created_at` (timestamptz)

    - `chat_channels` - Department/group channels
      - `id` (uuid, PK)
      - `hospital_id` (uuid, FK)
      - `name` (text)
      - `type` (text: direct, group, department)
      - `created_at` (timestamptz)

    - `channel_members` - Channel membership
      - `id` (uuid, PK)
      - `channel_id` (uuid, FK)
      - `user_id` (uuid, FK to profiles)
      - `joined_at` (timestamptz)

    - `messages` - Chat messages
      - `id` (uuid, PK)
      - `channel_id` (uuid, FK)
      - `sender_id` (uuid, FK to profiles)
      - `content` (text)
      - `message_type` (text: text, file, image, system)
      - `created_at` (timestamptz)

    - `shifts` - Shift scheduling
      - `id` (uuid, PK)
      - `hospital_id` (uuid, FK)
      - `user_id` (uuid, FK to profiles)
      - `date` (date)
      - `shift_type` (text: morning, evening, night)
      - `start_time` (time)
      - `end_time` (time)
      - `status` (text: scheduled, active, completed, cancelled)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on ALL tables
    - All policies restrict to authenticated users
    - Users can only access data within their hospital
    - Users can only modify their own records unless admin
*/

-- Hospitals
CREATE TABLE IF NOT EXISTS hospitals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Profiles
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text DEFAULT '',
  role text DEFAULT 'nurse' CHECK (role IN ('nurse', 'doctor', 'admin', 'staff')),
  hospital_id uuid REFERENCES hospitals(id),
  department text DEFAULT '',
  avatar_url text DEFAULT '',
  shift_preference text DEFAULT 'morning' CHECK (shift_preference IN ('morning', 'evening', 'night')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Patients
CREATE TABLE IF NOT EXISTS patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id uuid REFERENCES hospitals(id),
  full_name text NOT NULL,
  date_of_birth date,
  gender text DEFAULT '',
  blood_type text DEFAULT '',
  room_number text DEFAULT '',
  bed_number text DEFAULT '',
  admission_date date DEFAULT CURRENT_DATE,
  diagnosis text DEFAULT '',
  risk_level text DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  attending_doctor_id uuid REFERENCES profiles(id),
  assigned_nurse_id uuid REFERENCES profiles(id),
  status text DEFAULT 'admitted' CHECK (status IN ('admitted', 'discharged', 'transferred')),
  created_at timestamptz DEFAULT now()
);

-- Patient Vitals
CREATE TABLE IF NOT EXISTS patient_vitals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  heart_rate integer DEFAULT 0,
  blood_pressure_systolic integer DEFAULT 0,
  blood_pressure_diastolic integer DEFAULT 0,
  temperature numeric(4,1) DEFAULT 0,
  oxygen_saturation integer DEFAULT 0,
  respiratory_rate integer DEFAULT 0,
  recorded_at timestamptz DEFAULT now()
);

-- Tasks
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id uuid REFERENCES hospitals(id),
  patient_id uuid REFERENCES patients(id),
  assigned_to uuid REFERENCES profiles(id),
  created_by uuid REFERENCES profiles(id),
  title text NOT NULL,
  description text DEFAULT '',
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  category text DEFAULT 'care' CHECK (category IN ('medication', 'care', 'assessment', 'procedure', 'other')),
  due_date timestamptz,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Medications
CREATE TABLE IF NOT EXISTS medications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  prescribed_by uuid REFERENCES profiles(id),
  medicine_name text NOT NULL,
  dosage text DEFAULT '',
  frequency text DEFAULT '',
  start_date date DEFAULT CURRENT_DATE,
  end_date date,
  instructions text DEFAULT '',
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'discontinued')),
  created_at timestamptz DEFAULT now()
);

-- Medication Logs
CREATE TABLE IF NOT EXISTS medication_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  medication_id uuid REFERENCES medications(id) ON DELETE CASCADE,
  administered_by uuid REFERENCES profiles(id),
  administered_at timestamptz DEFAULT now(),
  notes text DEFAULT '',
  status text DEFAULT 'given' CHECK (status IN ('given', 'skipped', 'refused'))
);

-- Alerts
CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id uuid REFERENCES hospitals(id),
  patient_id uuid REFERENCES patients(id),
  created_by uuid REFERENCES profiles(id),
  title text NOT NULL,
  message text DEFAULT '',
  severity text DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'urgent', 'critical')),
  category text DEFAULT 'system' CHECK (category IN ('emergency', 'medication', 'task', 'system', 'patient')),
  is_resolved boolean DEFAULT false,
  resolved_by uuid REFERENCES profiles(id),
  resolved_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Chat Channels
CREATE TABLE IF NOT EXISTS chat_channels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id uuid REFERENCES hospitals(id),
  name text NOT NULL,
  type text DEFAULT 'group' CHECK (type IN ('direct', 'group', 'department')),
  created_at timestamptz DEFAULT now()
);

-- Channel Members
CREATE TABLE IF NOT EXISTS channel_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id uuid REFERENCES chat_channels(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at timestamptz DEFAULT now()
);

-- Messages
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id uuid REFERENCES chat_channels(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES profiles(id),
  content text NOT NULL,
  message_type text DEFAULT 'text' CHECK (message_type IN ('text', 'file', 'image', 'system')),
  created_at timestamptz DEFAULT now()
);

-- Shifts
CREATE TABLE IF NOT EXISTS shifts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id uuid REFERENCES hospitals(id),
  user_id uuid REFERENCES profiles(id),
  date date DEFAULT CURRENT_DATE,
  shift_type text DEFAULT 'morning' CHECK (shift_type IN ('morning', 'evening', 'night')),
  start_time time DEFAULT '07:00',
  end_time time DEFAULT '15:00',
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'active', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_vitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE medication_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE channel_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can view profiles in hospital" ON profiles FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.hospital_id = profiles.hospital_id)
);

-- Hospitals policies
CREATE POLICY "Authenticated users can read hospitals" ON hospitals FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin users can manage hospitals" ON hospitals FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Patients policies
CREATE POLICY "Hospital staff can read patients" ON patients FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND profiles.hospital_id = patients.hospital_id)
);
CREATE POLICY "Hospital staff can create patients" ON patients FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND profiles.hospital_id = patients.hospital_id)
);
CREATE POLICY "Hospital staff can update patients" ON patients FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND profiles.hospital_id = patients.hospital_id)
) WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND profiles.hospital_id = patients.hospital_id)
);

-- Patient vitals policies
CREATE POLICY "Hospital staff can read vitals" ON patient_vitals FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM patients p
    JOIN profiles pr ON pr.hospital_id = p.hospital_id
    WHERE p.id = patient_vitals.patient_id AND pr.id = auth.uid()
  )
);
CREATE POLICY "Hospital staff can insert vitals" ON patient_vitals FOR INSERT TO authenticated WITH CHECK (
  EXISTS (
    SELECT 1 FROM patients p
    JOIN profiles pr ON pr.hospital_id = p.hospital_id
    WHERE p.id = patient_vitals.patient_id AND pr.id = auth.uid()
  )
);

-- Tasks policies
CREATE POLICY "Users can read assigned tasks" ON tasks FOR SELECT TO authenticated USING (
  assigned_to = auth.uid() OR created_by = auth.uid() OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND profiles.hospital_id = tasks.hospital_id)
);
CREATE POLICY "Users can create tasks" ON tasks FOR INSERT TO authenticated WITH CHECK (
  created_by = auth.uid()
);
CREATE POLICY "Users can update assigned tasks" ON tasks FOR UPDATE TO authenticated USING (
  assigned_to = auth.uid() OR created_by = auth.uid()
) WITH CHECK (
  assigned_to = auth.uid() OR created_by = auth.uid()
);

-- Medications policies
CREATE POLICY "Hospital staff can read medications" ON medications FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM patients p
    JOIN profiles pr ON pr.hospital_id = p.hospital_id
    WHERE p.id = medications.patient_id AND pr.id = auth.uid()
  )
);
CREATE POLICY "Doctors can prescribe medications" ON medications FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('doctor', 'admin'))
);
CREATE POLICY "Doctors can update medications" ON medications FOR UPDATE TO authenticated USING (
  prescribed_by = auth.uid()
) WITH CHECK (
  prescribed_by = auth.uid()
);

-- Medication logs policies
CREATE POLICY "Hospital staff can read med logs" ON medication_logs FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM medications m
    JOIN patients p ON p.id = m.patient_id
    JOIN profiles pr ON pr.hospital_id = p.hospital_id
    WHERE m.id = medication_logs.medication_id AND pr.id = auth.uid()
  )
);
CREATE POLICY "Hospital staff can create med logs" ON medication_logs FOR INSERT TO authenticated WITH CHECK (
  administered_by = auth.uid()
);

-- Alerts policies
CREATE POLICY "Hospital staff can read alerts" ON alerts FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND profiles.hospital_id = alerts.hospital_id)
);
CREATE POLICY "Hospital staff can create alerts" ON alerts FOR INSERT TO authenticated WITH CHECK (
  created_by = auth.uid()
);
CREATE POLICY "Hospital staff can resolve alerts" ON alerts FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND profiles.hospital_id = alerts.hospital_id)
) WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND profiles.hospital_id = alerts.hospital_id)
);

-- Chat channels policies
CREATE POLICY "Channel members can read channels" ON chat_channels FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM channel_members WHERE channel_id = chat_channels.id AND user_id = auth.uid())
);
CREATE POLICY "Admins can create channels" ON chat_channels FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'doctor'))
);

-- Channel members policies
CREATE POLICY "Members can read membership" ON channel_members FOR SELECT TO authenticated USING (
  user_id = auth.uid() OR
  EXISTS (SELECT 1 FROM channel_members cm WHERE cm.channel_id = channel_members.channel_id AND cm.user_id = auth.uid())
);
CREATE POLICY "Users can join channels" ON channel_members FOR INSERT TO authenticated WITH CHECK (
  user_id = auth.uid()
);

-- Messages policies
CREATE POLICY "Channel members can read messages" ON messages FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM channel_members WHERE channel_id = messages.channel_id AND user_id = auth.uid())
);
CREATE POLICY "Channel members can send messages" ON messages FOR INSERT TO authenticated WITH CHECK (
  sender_id = auth.uid() AND
  EXISTS (SELECT 1 FROM channel_members WHERE channel_id = messages.channel_id AND user_id = auth.uid())
);

-- Shifts policies
CREATE POLICY "Users can read own shifts" ON shifts FOR SELECT TO authenticated USING (
  user_id = auth.uid() OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND profiles.hospital_id = shifts.hospital_id AND role IN ('admin', 'doctor'))
);
CREATE POLICY "Admins can manage shifts" ON shifts FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'doctor'))
);
CREATE POLICY "Admins can update shifts" ON shifts FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'doctor'))
) WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'doctor'))
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_patients_hospital ON patients(hospital_id);
CREATE INDEX IF NOT EXISTS idx_patients_nurse ON patients(assigned_nurse_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_vitals_patient ON patient_vitals(patient_id);
CREATE INDEX IF NOT EXISTS idx_alerts_hospital ON alerts(hospital_id);
CREATE INDEX IF NOT EXISTS idx_alerts_resolved ON alerts(is_resolved);
CREATE INDEX IF NOT EXISTS idx_messages_channel ON messages(channel_id);
CREATE INDEX IF NOT EXISTS idx_shifts_user ON shifts(user_id);
CREATE INDEX IF NOT EXISTS idx_medications_patient ON medications(patient_id);
