'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import {
  MessageSquare,
  ThumbsUp,
  Tag,
  Plus,
  CheckCircle2,
  Loader2,
  Trash2,
  AlertTriangle,
  Trophy,
  Sparkles,
  GraduationCap
} from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const popularTags = [
  { name: 'career', icon: Trophy },
  { name: 'technical', icon: Sparkles },
  { name: 'academics', icon: GraduationCap },
  { name: 'interviews', icon: MessageSquare },
  { name: 'preparation', icon: CheckCircle2 }
];

export default function SeniorConnectPage() {
  const { user } = useUser();
  const [dbuser, setDbUser] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState(null);
  const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState(false);
  const [isAnswerDialogOpen, setIsAnswerDialogOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: []
  });
  const [answerContent, setAnswerContent] = useState('');

  useEffect(() => {
    fetchQuestions();
  }, [user, selectedTag]);

  const fetchQuestions = async () => {
    try {
      const url = new URL('/api/senior-corner', window.location.origin);
      if (user) url.searchParams.append('user_id', user.id);
      if (selectedTag) url.searchParams.append('tag', selectedTag);
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch questions');
      const data = await response.json();
      setQuestions(data.questions || data.enhancedQuestions || []);
      setDbUser(data.dbuser || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to load questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTagSelect = (tag) => {
    setSelectedTag(selectedTag === tag ? null : tag);
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to ask questions");
      return;
    }

    try {
      const newQuestion = {
        ...formData,
        author: {
          name: user.fullName || user.username,
          avatar: user.imageUrl,
          userId: user.id,
          year: "3rd Year" // This should come from user profile
        }
      };

      const response = await fetch('/api/senior-corner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newQuestion),
      });

      if (!response.ok) throw new Error('Failed to post question');

      toast.success("Question posted successfully! You earned 5 points!");
      setIsQuestionDialogOpen(false);
      setFormData({ title: '', content: '', tags: [] });
      fetchQuestions();
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to post question. Please try again.");
    }
  };

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to answer questions");
      return;
    }

    try {
      const response = await fetch('/api/senior-corner', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question_id: selectedQuestion._id,
          action: 'answer',
          answer: {
            content: answerContent,
            author: {
              name: user.fullName || user.username,
              avatar: user.imageUrl,
              userId: user.id,
              year: dbuser.current_year, // This should come from user profile
            }
          }
        }),
      });

      if (!response.ok) throw new Error('Failed to post answer');

      toast.success("Answer posted successfully! You earned 10 points!");
      setIsAnswerDialogOpen(false);
      setAnswerContent('');
      setSelectedQuestion(null);
      fetchQuestions();
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to post answer. Please try again.");
    }
  };

  const handleVote = async (questionId, answerId) => {
    if (!user) {
      toast.error("Please sign in to vote");
      return;
    }

    try {
      const response = await fetch('/api/senior-corner', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question_id: questionId,
          answer_id: answerId,
          user_id: user.id,
          action: 'vote'
        }),
      });

      if (!response.ok) throw new Error('Failed to vote');
      fetchQuestions();
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to vote. Please try again.");
    }
  };

  const handleAcceptAnswer = async (questionId, answerId) => {
    try {
      const response = await fetch('/api/senior-corner', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question_id: questionId,
          answer_id: answerId,
          action: 'accept'
        }),
      });

      if (!response.ok) throw new Error('Failed to accept answer');
      
      toast.success("Answer accepted! The author earned 15 points!");
      fetchQuestions();
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to accept answer. Please try again.");
    }
  };

  const handleDelete = async (questionId) => {
    try {
      const response = await fetch(`/api/senior-corner?id=${questionId}&user_id=${user.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete question');

      toast.success("Question deleted successfully!");
      fetchQuestions();
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to delete question. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-white p-6 lg:p-8">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 right-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Senior Connect
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Get guidance from seniors and alumni. Share knowledge, ask questions, and help others grow.
          </p>
        </div>

        {/* Tags Section */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          {popularTags.map(({ name, icon: Icon }) => (
            <Button
              key={name}
              variant={selectedTag === name ? 'default' : 'outline'}
              className="gap-2"
              onClick={() => handleTagSelect(name)}
            >
              <Icon className="w-4 h-4" />
              {name}
            </Button>
          ))}
        </div>

        {/* Questions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {questions.length === 0 ? (
            <Card className="col-span-full p-8 text-center">
              <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No questions found</h3>
              <p className="text-gray-600 mb-4">
                {selectedTag 
                  ? `No questions found with the tag '${selectedTag}'`
                  : "Be the first to ask a question!"}
              </p>
              <Dialog open={isQuestionDialogOpen} onOpenChange={setIsQuestionDialogOpen}>
                <DialogTrigger asChild>
                  <Button>Ask a Question</Button>
                </DialogTrigger>
                {/* Question Dialog Content */}
              </Dialog>
            </Card>
          ) : (
            questions.map((question) => (
              <Card
                key={question._id}
                className="overflow-hidden backdrop-blur-sm bg-white/80 border-2 hover:border-blue-200 transition-all duration-300 hover:shadow-xl"
              >
                {/* Question Header */}
                <div className="p-4 flex items-center justify-between border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={question.author.avatar} alt={question.author.name} />
                      <AvatarFallback>{question.author.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{question.author.name}</h3>
                        <Badge variant="secondary">{question.author.year}</Badge>
                      </div>
                      <p className="text-sm text-gray-500">
                        {format(new Date(question.createdAt), 'PPP')}
                      </p>
                    </div>
                  </div>
                  {user && question.author.userId === user.id && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-gray-500 hover:text-red-500">
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Question</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this question? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(question._id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>

                {/* Question Content */}
                <div className="p-4">
                  <h2 className="text-xl font-bold mb-2">
                    {question.title}
                    {question.solved && (
                      <Badge variant="success\" className="ml-2">
                        Solved
                      </Badge>
                    )}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {question.content}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {question.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="cursor-pointer" onClick={() => handleTagSelect(tag)}>
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Question Stats & Actions */}
                <div className="p-4 bg-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-gray-600">
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      {question.answers.length}
                    </span>
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="w-4 h-4" />
                      {question.answers.reduce((sum, ans) => sum + ans.votes, 0)}
                    </span>
                  </div>
                  <Button
                    onClick={() => {
                      setSelectedQuestion(question);
                      setIsAnswerDialogOpen(true);
                    }}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    Answer
                  </Button>
                </div>

                {/* Answers Section */}
                {question.answers.length > 0 && (
                  <div className="border-t border-gray-100">
                    {question.answers.map((answer) => (
                      <div
                        key={answer._id}
                        className={`p-4 flex gap-4 ${
                          answer.isAccepted ? 'bg-green-50' : ''
                        }`}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleVote(question._id, answer._id)}
                            disabled={answer.hasVoted}
                            className={`${
                              answer.hasVoted ? 'text-blue-600' : 'text-gray-500'
                            }`}
                          >
                            <ThumbsUp className="w-4 h-4" />
                          </Button>
                          <span className="text-sm font-medium">{answer.votes}</span>
                          {question.author.userId === user?.id && !question.solved && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleAcceptAnswer(question._id, answer._id)}
                              className="text-green-600"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Avatar className="w-6 h-6">
                              <AvatarImage src={answer.author.avatar} alt={answer.author.name} />
                              <AvatarFallback>{answer.author.name[0]}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">{answer.author.name}</span>
                            <Badge variant="secondary">{answer.author.year}</Badge>
                            {answer.isAccepted && (
                              <Badge variant="success" className="bg-green-500">
                                Accepted Answer
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-600">{answer.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            ))
          )}
        </div>

        {/* Ask Question Button */}
        <Dialog open={isQuestionDialogOpen} onOpenChange={setIsQuestionDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="fixed bottom-8 right-8 w-16 h-16 rounded-full shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105"
            >
              <Plus className="w-6 h-6" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Ask a Question</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleQuestionSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="What's your question?"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Details</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Provide more context..."
                  className="min-h-[150px]"
                />
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map(({ name, icon: Icon }) => (
                    <Badge
                      key={name}
                      variant={formData.tags.includes(name) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          tags: prev.tags.includes(name)
                            ? prev.tags.filter(t => t !== name)
                            : [...prev.tags, name]
                        }));
                      }}
                    >
                      <Icon className="w-3 h-3 mr-1" />
                      {name}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => setIsQuestionDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Post Question
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Answer Dialog */}
        <Dialog open={isAnswerDialogOpen} onOpenChange={setIsAnswerDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Post Answer</DialogTitle>
            </DialogHeader>
            {selectedQuestion && (
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-2">{selectedQuestion.title}</h3>
                <p className="text-gray-600 text-sm">{selectedQuestion.content}</p>
              </div>
            )}
            <form onSubmit={handleAnswerSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="answer">Your Answer</Label>
                <Textarea
                  id="answer"
                  value={answerContent}
                  onChange={(e) => setAnswerContent(e.target.value)}
                  placeholder="Share your knowledge..."
                  className="min-h-[200px]"
                />
              </div>

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => {
                  setIsAnswerDialogOpen(false);
                  setSelectedQuestion(null);
                  setAnswerContent('');
                }}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Post Answer
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}