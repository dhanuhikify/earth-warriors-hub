import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BookOpen, Calendar, CheckCircle, Clock, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Assignment {
  id: string;
  title: string;
  description: string;
  due_date: string | null;
  created_at: string;
}

interface AssignmentSubmission {
  id: string;
  submission_text: string;
  submitted_at: string;
  grade: number | null;
  feedback: string | null;
}

interface AssignmentCardProps {
  assignment: Assignment;
  submission?: AssignmentSubmission;
  onSubmissionUpdate: () => void;
}

const AssignmentCard = ({ assignment, submission, onSubmissionUpdate }: AssignmentCardProps) => {
  const { toast } = useToast();
  const [submissionText, setSubmissionText] = useState(submission?.submission_text || '');
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const submitAssignment = async () => {
    if (!submissionText.trim()) {
      toast({
        title: "Please enter your submission",
        description: "Assignment submission cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to submit assignments.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from('assignment_submissions')
      .upsert({
        assignment_id: assignment.id,
        student_id: user.id,
        submission_text: submissionText,
      });

    if (error) {
      toast({
        title: "Error submitting assignment",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Assignment submitted successfully",
        description: "Your teacher will review your submission.",
      });
      setShowDialog(false);
      onSubmissionUpdate();
    }
    setLoading(false);
  };

  const isOverdue = assignment.due_date && new Date(assignment.due_date) < new Date();
  const isSubmitted = !!submission;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-emerald-600" />
            {assignment.title}
          </CardTitle>
          <div className="flex gap-2">
            {isSubmitted && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Submitted
              </Badge>
            )}
            {submission?.grade !== null && (
              <Badge variant="outline">
                Grade: {submission.grade}/100
              </Badge>
            )}
            {isOverdue && !isSubmitted && (
              <Badge variant="destructive">Overdue</Badge>
            )}
          </div>
        </div>
        <CardDescription>
          Assigned: {new Date(assignment.created_at).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">
          {assignment.description}
        </p>
        
        {assignment.due_date && (
          <div className="flex items-center gap-2 text-sm text-orange-600 mb-4">
            <Calendar className="h-4 w-4" />
            Due: {new Date(assignment.due_date).toLocaleDateString()}
          </div>
        )}

        {submission && (
          <div className="space-y-3 mb-4">
            <div>
              <h4 className="font-medium text-sm text-gray-700">Your Submission:</h4>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                {submission.submission_text}
              </p>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              Submitted: {new Date(submission.submitted_at).toLocaleDateString()}
            </div>

            {submission.feedback && (
              <div>
                <h4 className="font-medium text-sm text-gray-700">Teacher Feedback:</h4>
                <p className="text-sm text-gray-600 bg-emerald-50 p-3 rounded-md">
                  {submission.feedback}
                </p>
              </div>
            )}
          </div>
        )}

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button 
              className="w-full" 
              variant={isSubmitted ? "outline" : "default"}
              disabled={isOverdue && !isSubmitted}
            >
              <FileText className="h-4 w-4 mr-2" />
              {isSubmitted ? "Update Submission" : "Submit Assignment"}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{assignment.title}</DialogTitle>
              <DialogDescription>
                {assignment.description}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Your Submission:</label>
                <Textarea
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                  placeholder="Enter your assignment submission here..."
                  rows={6}
                  className="mt-1"
                />
              </div>
              <Button 
                onClick={submitAssignment} 
                disabled={loading || !submissionText.trim()}
                className="w-full"
              >
                {loading ? "Submitting..." : (isSubmitted ? "Update Submission" : "Submit Assignment")}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default AssignmentCard;