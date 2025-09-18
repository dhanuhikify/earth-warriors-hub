-- Create assignments table
CREATE TABLE public.assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create assignment submissions table
CREATE TABLE public.assignment_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL,
  submission_text TEXT,
  submission_file_url TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  grade INTEGER,
  feedback TEXT,
  UNIQUE(assignment_id, student_id)
);

-- Enable RLS
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for assignments
CREATE POLICY "Teachers can view their own assignments"
ON public.assignments
FOR SELECT
USING (auth.uid() = teacher_id);

CREATE POLICY "Teachers can create assignments"
ON public.assignments
FOR INSERT
WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "Teachers can update their own assignments"
ON public.assignments
FOR UPDATE
USING (auth.uid() = teacher_id);

CREATE POLICY "Teachers can delete their own assignments"
ON public.assignments
FOR DELETE
USING (auth.uid() = teacher_id);

CREATE POLICY "Students can view all assignments"
ON public.assignments
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE user_id = auth.uid() AND role = 'student'
));

-- RLS Policies for assignment submissions
CREATE POLICY "Students can view their own submissions"
ON public.assignment_submissions
FOR SELECT
USING (auth.uid() = student_id);

CREATE POLICY "Students can create their own submissions"
ON public.assignment_submissions
FOR INSERT
WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update their own submissions"
ON public.assignment_submissions
FOR UPDATE
USING (auth.uid() = student_id);

CREATE POLICY "Teachers can view submissions for their assignments"
ON public.assignment_submissions
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.assignments 
  WHERE id = assignment_id AND teacher_id = auth.uid()
));

CREATE POLICY "Teachers can update submissions for their assignments (grading)"
ON public.assignment_submissions
FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM public.assignments 
  WHERE id = assignment_id AND teacher_id = auth.uid()
));

-- Add trigger for assignment updates
CREATE TRIGGER update_assignments_updated_at
BEFORE UPDATE ON public.assignments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();