import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Plus, Calendar, Users, BookOpen, FileText, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Session, User } from "@supabase/supabase-js";

interface Assignment {
  id: string;
  title: string;
  description: string;
  due_date: string;
  created_at: string;
}

interface AssignmentSubmission {
  id: string;
  assignment_id: string;
  student_id: string;
  submission_text: string;
  submitted_at: string;
  grade: number | null;
  feedback: string | null;
  student_name?: string;
}

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session?.user) {
        navigate('/auth');
        return;
      }

      // Check if user is a teacher
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', session.user.id)
        .single();

      if (profile?.role !== 'teacher') {
        navigate('/dashboard');
        return;
      }

      loadAssignments();
    };

    checkAuth();
  }, [navigate]);

  const loadAssignments = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('assignments')
      .select('*')
      .eq('teacher_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error loading assignments",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setAssignments(data || []);
      if (data && data.length > 0) {
        loadSubmissions();
      }
    }
  };

  const loadSubmissions = async () => {
    if (!user || assignments.length === 0) return;
    
    const { data, error } = await supabase
      .from('assignment_submissions')
      .select('*')
      .in('assignment_id', assignments.map(a => a.id))
      .order('submitted_at', { ascending: false });

    if (error) {
      toast({
        title: "Error loading submissions",
        description: error.message,
        variant: "destructive",
      });
    } else {
      // Get student names for each submission
      const submissionsWithNames = await Promise.all(
        (data || []).map(async (submission) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('user_id', submission.student_id)
            .single();
          
          return {
            ...submission,
            student_name: profile?.full_name || 'Unknown Student'
          };
        })
      );
      
      setSubmissions(submissionsWithNames);
    }
  };

  const createAssignment = async () => {
    if (!user || !title || !description) return;

    setLoading(true);
    const { error } = await supabase
      .from('assignments')
      .insert({
        teacher_id: user.id,
        title,
        description,
        due_date: dueDate ? new Date(dueDate).toISOString() : null,
      });

    if (error) {
      toast({
        title: "Error creating assignment",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Assignment created successfully",
        description: "Students can now see and submit this assignment.",
      });
      setTitle('');
      setDescription('');
      setDueDate('');
      setShowCreateDialog(false);
      loadAssignments();
    }
    setLoading(false);
  };

  const gradeSubmission = async (submissionId: string, grade: number, feedback: string) => {
    const { error } = await supabase
      .from('assignment_submissions')
      .update({ grade, feedback })
      .eq('id', submissionId);

    if (error) {
      toast({
        title: "Error grading submission",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Submission graded successfully",
        description: "The student will see their grade and feedback.",
      });
      loadSubmissions();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/dashboard')}
              className="hover:bg-white/20"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
              <p className="text-gray-600">Manage assignments and view student submissions</p>
            </div>
          </div>
          
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Assignment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Assignment</DialogTitle>
                <DialogDescription>
                  Create a new assignment for your students to complete.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Assignment Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter assignment title"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter assignment description and instructions"
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="dueDate">Due Date (Optional)</Label>
                  <Input
                    id="dueDate"
                    type="datetime-local"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={createAssignment} 
                  disabled={loading || !title || !description}
                  className="w-full"
                >
                  {loading ? "Creating..." : "Create Assignment"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="assignments" className="space-y-6">
          <TabsList className="grid grid-cols-2 w-full max-w-md">
            <TabsTrigger value="assignments" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              My Assignments
            </TabsTrigger>
            <TabsTrigger value="submissions" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Submissions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="assignments">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {assignments.map((assignment) => (
                <Card key={assignment.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-emerald-600" />
                      {assignment.title}
                    </CardTitle>
                    <CardDescription>
                      Created: {new Date(assignment.created_at).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                      {assignment.description}
                    </p>
                    {assignment.due_date && (
                      <div className="flex items-center gap-2 text-sm text-orange-600">
                        <Calendar className="h-4 w-4" />
                        Due: {new Date(assignment.due_date).toLocaleDateString()}
                      </div>
                    )}
                    <div className="mt-3 text-sm text-gray-500">
                      Submissions: {submissions.filter(s => s.assignment_id === assignment.id).length}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="submissions">
            <div className="space-y-4">
              {submissions.map((submission) => (
                <Card key={submission.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-blue-600" />
                          {submission.student_name || 'Unknown Student'}
                        </CardTitle>
                        <CardDescription>
                          Assignment: {assignments.find(a => a.id === submission.assignment_id)?.title}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {submission.grade !== null ? (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            {submission.grade}/100
                          </Badge>
                        ) : (
                          <Badge variant="outline">Pending Grade</Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-sm text-gray-700">Submission:</h4>
                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                          {submission.submission_text}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        Submitted: {new Date(submission.submitted_at).toLocaleDateString()}
                      </div>

                      {submission.feedback && (
                        <div>
                          <h4 className="font-medium text-sm text-gray-700">Your Feedback:</h4>
                          <p className="text-sm text-gray-600 bg-emerald-50 p-3 rounded-md">
                            {submission.feedback}
                          </p>
                        </div>
                      )}

                      <div className="flex gap-2 pt-2">
                        <Input
                          type="number"
                          placeholder="Grade (0-100)"
                          min="0"
                          max="100"
                          className="w-32"
                          defaultValue={submission.grade || ''}
                          id={`grade-${submission.id}`}
                        />
                        <Input
                          placeholder="Feedback (optional)"
                          className="flex-1"
                          defaultValue={submission.feedback || ''}
                          id={`feedback-${submission.id}`}
                        />
                        <Button
                          size="sm"
                          onClick={() => {
                            const gradeInput = document.getElementById(`grade-${submission.id}`) as HTMLInputElement;
                            const feedbackInput = document.getElementById(`feedback-${submission.id}`) as HTMLInputElement;
                            const grade = parseInt(gradeInput.value);
                            const feedback = feedbackInput.value;
                            
                            if (!isNaN(grade)) {
                              gradeSubmission(submission.id, grade, feedback);
                            }
                          }}
                        >
                          Grade
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {submissions.length === 0 && (
                <Card>
                  <CardContent className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No submissions yet</p>
                    <p className="text-sm text-gray-400">Student submissions will appear here</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TeacherDashboard;