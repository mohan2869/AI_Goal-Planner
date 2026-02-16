import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { createGoal } from '../api/goal';
import ProgressTracker from '../components/ui/ProgressTracker';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Target, CheckCircle2, Brain, Clock, Lightbulb } from "lucide-react";
import Navbar from '@/components/ui/Navbar';

const GoalSetup = () => {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [numberOfDays, setNumberOfDays] = useState('');
  const [hoursPerDay, setHoursPerDay] = useState('');
  const [ytLink, setYtLink] = useState('');
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checkedTasks, setCheckedTasks] = useState({});
  const [progress, setProgress] = useState(0);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getTaskDate = (startDate, dayNumber) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + (dayNumber - 1));
    return formatDate(date);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await createGoal({ 
        title, 
        startDate,
        numberOfDays,
        hoursPerDay, 
        ytLink 
      });
  
      if (result.dailyPlan) {
        setPlan(result.dailyPlan);
        
        // Initialize checkboxes
        const initialChecks = {};
        result.dailyPlan.forEach((dayPlan, dayIndex) => {
          initialChecks[dayIndex] = {};
        });
        setCheckedTasks(initialChecks);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const parseTasks = (taskString) => {
    if (!taskString) return [];
    
    const sections = [];
    const lines = taskString.split('\n');
    let currentSection = null;
    
    for (const line of lines) {
      if (line.startsWith('**') && line.endsWith('**')) {
        if (currentSection) {
          sections.push(currentSection);
        }
        currentSection = {
          title: line.slice(2, -2).trim(),
          tasks: []
        };
      } else if (line.startsWith('*')) {
        const taskLine = line.slice(1).trim();
        const [mainTask, subtasksStr] = taskLine.split(':').map(s => s.trim());
        const subtasks = subtasksStr ? subtasksStr.split('•').map(s => s.trim()) : [];
        
        currentSection.tasks.push({
          mainTask,
          subtasks
        });
      }
    }
    
    if (currentSection) {
      sections.push(currentSection);
    }
    
    return sections;
  };

  const handleCheckboxChange = (dayIndex, sectionIndex, taskIndex, subtaskIndex) => {
    setCheckedTasks(prev => {
      const newChecks = { ...prev };
      const key = subtaskIndex !== undefined 
        ? `${dayIndex}-${sectionIndex}-${taskIndex}-${subtaskIndex}`
        : `${dayIndex}-${sectionIndex}-${taskIndex}`;
      
      newChecks[key] = !prev[key];
      return newChecks;
    });
  };

  // Calculate progress whenever checkedTasks changes
  useEffect(() => {
    if (!plan) return;

    let totalTasks = 0;
    let completedTasks = 0;

    plan.forEach((dayPlan, dayIndex) => {
      const sections = parseTasks(dayPlan.task || '');
      sections.forEach((section, sectionIndex) => {
        section.tasks.forEach((task, taskIndex) => {
          totalTasks++;
          if (checkedTasks[`${dayPlan.day}-${sectionIndex}-${taskIndex}`]) {
            completedTasks++;
          }
          task.subtasks.forEach((_, subtaskIndex) => {
            totalTasks++;
            if (checkedTasks[`${dayPlan.day}-${sectionIndex}-${taskIndex}-${subtaskIndex}`]) {
              completedTasks++;
            }
          });
        });
      });
    });

    const newProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    setProgress(newProgress);
  }, [checkedTasks, plan]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100vh-80px)]"
        >
          {/* Left Column - Form */}
          <div className="h-full">
            <Card className="border-none shadow-none bg-gradient-to-br from-primary/5 to-card h-full">
              <CardHeader className="space-y-1 py-2">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-full bg-primary/10">
                    <Target className="h-3.5 w-3.5 text-primary" />
                  </div>
              <div>
                    <CardTitle className="text-lg font-bold tracking-tight">Create Your Goal Plan</CardTitle>
                    <CardDescription className="text-xs mt-0.5 text-muted-foreground">
                      Set your learning goals and we'll create a personalized plan for you
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="py-1">
                <form onSubmit={handleSubmit} className="space-y-2">
                  <div className="space-y-1">
                    <div className="space-y-1">
                      <Label htmlFor="title" className="text-xs font-semibold">What's your goal?</Label>
                      <Input
                        id="title"
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g., Learn Python Programming"
                        className="h-8 text-xs"
                  required
                />
              </div>

                    <div className="grid grid-cols-1 gap-2">
                      <div className="space-y-1">
                        <Label htmlFor="startDate" className="text-xs font-semibold">Start Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full h-8 justify-start text-left font-normal text-xs",
                                !startDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-3 w-3" />
                              {startDate ? format(new Date(startDate), "PPP") : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={startDate ? new Date(startDate) : undefined}
                              onSelect={(date) => setStartDate(date ? date.toISOString().split('T')[0] : '')}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="numberOfDays" className="text-xs font-semibold">Number of Days</Label>
                        <Input
                          id="numberOfDays"
                          type="number"
                          value={numberOfDays}
                          onChange={e => setNumberOfDays(e.target.value)}
                          min="1"
                          placeholder="e.g., 30"
                          className="h-8 text-xs"
                    required
                  />
                </div>

                      <div className="space-y-1">
                        <Label htmlFor="hoursPerDay" className="text-xs font-semibold">Hours per day</Label>
                        <Input
                          id="hoursPerDay"
                    type="number"
                    value={hoursPerDay}
                    onChange={e => setHoursPerDay(e.target.value)}
                          min="1"
                          max="24"
                    placeholder="e.g., 2"
                          className="h-8 text-xs"
                    required
                  />
              </div>

                      <div className="space-y-1">
                        <Label htmlFor="ytLink" className="text-xs font-semibold">YouTube Playlist (optional)</Label>
                        <Input
                          id="ytLink"
                  type="text"
                  value={ytLink}
                  onChange={e => setYtLink(e.target.value)}
                  placeholder="Paste your YouTube playlist link"
                          className="h-8 text-xs"
                />
                      </div>
              </div>
            </div>

                  <Button
              type="submit"
              disabled={loading}
                    className="w-full h-8 text-xs font-semibold"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating Your Plan...
                </span>
              ) : (
                'Generate Plan'
              )}
                  </Button>
      </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Generated Plan or Illustration */}
          {plan ? (
            <div className="h-full overflow-hidden">
              <ScrollArea className="h-full w-full rounded-md">
                <div className="p-3 space-y-3">
          {plan.map((dayPlan, dayIndex) => {
              const sections = parseTasks(dayPlan.task || '');
              const taskDate = getTaskDate(startDate, dayPlan.day);
              
            return (
                      <Card key={dayIndex} className="hover:shadow-lg transition-shadow bg-gradient-to-br from-primary/5 to-card">
                        <CardHeader className="py-2">
                          <div className="flex items-center gap-2">
                            <div className="p-1 rounded-full bg-primary/10">
                              <CalendarIcon className="h-3.5 w-3.5 text-primary" />
                            </div>
                            <CardTitle className="text-base font-semibold">
                              Day {dayPlan.day} - {taskDate}
                            </CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="py-2">
                          <div className="space-y-3">
                    {sections.map((section, sectionIndex) => (
                              <div key={sectionIndex} className="space-y-1.5">
                                <div className="flex items-center gap-2">
                                  <h4 className="text-sm font-semibold text-primary">{section.title}</h4>
                                  <Badge variant="secondary" className="ml-auto text-xs">
                                    {section.tasks.length} tasks
                                  </Badge>
                                </div>
                                <Separator className="my-1" />
                                <div className="pl-2 space-y-2">
                          {section.tasks.map((task, taskIndex) => (
                                    <div key={taskIndex} className="space-y-1 bg-muted/50 p-2 rounded-lg">
                              <div className="flex items-start space-x-2">
                                        <Checkbox
                                  checked={checkedTasks[`${dayPlan.day}-${sectionIndex}-${taskIndex}`] || false}
                                          onCheckedChange={() => handleCheckboxChange(dayPlan.day, sectionIndex, taskIndex)}
                                          className="mt-0.5 h-3.5 w-3.5"
                                />
                                <div className="flex-1">
                                          <span className="text-xs font-medium">{task.mainTask}</span>
                                  {task.subtasks.length > 0 && (
                                            <div className="mt-1 pl-4 space-y-1">
                                      {task.subtasks.map((subtask, subtaskIndex) => (
                                        <div key={subtaskIndex} className="flex items-start space-x-2">
                                                  <Checkbox
                                            checked={checkedTasks[`${dayPlan.day}-${sectionIndex}-${taskIndex}-${subtaskIndex}`] || false}
                                                    onCheckedChange={() => handleCheckboxChange(dayPlan.day, sectionIndex, taskIndex, subtaskIndex)}
                                                    className="mt-0.5 h-3.5 w-3.5"
                                          />
                                                  <span className="text-xs text-muted-foreground">{subtask}</span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
              </div>
                        </CardContent>
                      </Card>
            );
          })}
                </div>
              </ScrollArea>
            </div>
          ) : (
            <div className="h-full">
              <Card className="border-none shadow-none bg-gradient-to-br from-primary/5 to-card h-full">
                <CardContent className="flex flex-col items-center justify-center h-full p-4 text-center">
                  <div className="mb-4 p-3 rounded-full bg-primary/10">
                    <Brain className="h-10 w-10 text-primary" />
                  </div>
                  <h2 className="text-lg font-bold mb-2">Your Personalized Learning Plan</h2>
                  <p className="text-xs text-muted-foreground mb-4 max-w-md">
                    Fill out the form on the left to generate a customized learning plan tailored to your goals and schedule.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-2 w-full max-w-md">
                    <div className="space-y-1 p-2 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-1">
                        <Target className="h-3 w-3 text-primary" />
                        <span className="text-xs font-medium">Clear Goals</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">Define your learning objectives</p>
                    </div>
                    
                    <div className="space-y-1 p-2 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3 text-primary" />
                        <span className="text-xs font-medium">Flexible Schedule</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">Set your own pace</p>
                    </div>
                    
                    <div className="space-y-1 p-2 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-primary" />
                        <span className="text-xs font-medium">Time Management</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">Optimize your study time</p>
                    </div>
                    
                    <div className="space-y-1 p-2 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3 text-primary" />
                        <span className="text-xs font-medium">Track Progress</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">Monitor your achievements</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/10">
                    <div className="flex items-center gap-1 mb-1">
                      <Lightbulb className="h-3 w-3 text-primary" />
                      <span className="text-xs font-medium">Pro Tip</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      For best results, be specific about your goals and realistic about your available time.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          </motion.div>
        </div>
    </div>
  );
};

export default GoalSetup;
