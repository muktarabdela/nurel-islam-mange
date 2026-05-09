"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import TopNavBar from "@/components/TopNavBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Edit, CheckCircle, Circle, Calendar, Filter, Search } from "lucide-react";
import { isAuthenticated } from "@/lib/auth";

interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
}

export default function TodosPage() {
  const router = useRouter();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [newTodo, setNewTodo] = useState({
    title: "",
    description: ""
  });


  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    
    // Load todos from localStorage
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
    setLoading(false);
  }, [router]);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    if (todos.length > 0 || localStorage.getItem('todos')) {
      localStorage.setItem('todos', JSON.stringify(todos));
    }
  }, [todos]);

  const addTodo = () => {
    if (!newTodo.title.trim()) return;

    const todo: Todo = {
      id: Date.now().toString(),
      title: newTodo.title,
      description: newTodo.description,
      completed: false,
      createdAt: new Date().toISOString()
    };

    setTodos([todo, ...todos]);
    setNewTodo({
      title: "",
      description: ""
    });
    setIsAddDialogOpen(false);
  };

  const updateTodo = () => {
    if (!editingTodo || !newTodo.title.trim()) return;

    const updatedTodos = todos.map(todo =>
      todo.id === editingTodo.id
        ? {
            ...todo,
            title: newTodo.title,
            description: newTodo.description
          }
        : todo
    );

    setTodos(updatedTodos);
    setIsEditDialogOpen(false);
    setEditingTodo(null);
    setNewTodo({
      title: "",
      description: ""
    });
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const startEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setNewTodo({
      title: todo.title,
      description: todo.description
    });
    setIsEditDialogOpen(true);
  };


  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         todo.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;
  const completionRate = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  if (loading) {
    return (
      <div className="flex bg-background min-h-screen font-body-md antialiased text-on-background">
        <Sidebar />
        <div className="md:ml-[280px] flex-1 flex flex-col min-h-screen overflow-hidden">
          <TopNavBar />
          <main className="flex-1 p-8 pb-xxl max-w-[1440px] mx-auto w-full overflow-y-auto">
            <div className="flex items-center justify-center h-64">
              <div className="text-muted-foreground">Loading todos...</div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-background min-h-screen font-body-md antialiased text-on-background">
      <Sidebar />
      <div className="md:ml-[280px] flex-1 flex flex-col min-h-screen overflow-hidden">
        <TopNavBar />
        <main className="flex-1 p-8 pb-xxl max-w-[1440px] mx-auto w-full overflow-y-auto">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h2 className="font-h2 text-h2 text-on-background mb-1">
                Todo List Management
              </h2>
              <p className="font-body-sm text-body-sm">
                Organize and track your tasks efficiently.
              </p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Todo
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Todo</DialogTitle>
                  <DialogDescription>
                    Create a new todo item to track your tasks.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newTodo.title}
                      onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                      placeholder="Enter todo title..."
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newTodo.description}
                      onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                      placeholder="Enter description (optional)..."
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={addTodo}>Add Todo</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Tasks
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Completed
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{completedCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pending
                </CardTitle>
                <Circle className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{totalCount - completedCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Completion Rate
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completionRate.toFixed(0)}%</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search todos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Todo List */}
          <Card>
            <CardHeader>
              <CardTitle>Todo Items</CardTitle>
              <CardDescription>
                {filteredTodos.length} {filteredTodos.length === 1 ? 'item' : 'items'} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredTodos.length > 0 ? (
                <div className="space-y-4">
                  {filteredTodos.map(todo => (
                    <div
                      key={todo.id}
                      className={`flex items-start gap-3 p-4 rounded-lg border ${
                        todo.completed ? 'bg-muted/50 opacity-75' : 'bg-background'
                      }`}
                    >
                      <Checkbox
                        checked={todo.completed}
                        onCheckedChange={() => toggleTodo(todo.id)}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`font-medium truncate ${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
                            {todo.title}
                          </h4>
                        </div>
                        {todo.description && (
                          <p className={`text-sm text-muted-foreground mb-2 ${todo.completed ? 'line-through' : ''}`}>
                            {todo.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Created: {new Date(todo.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEdit(todo)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteTodo(todo.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Circle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">No todos found</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {searchTerm
                      ? "Try adjusting your search terms."
                      : "Get started by adding your first todo item."}
                  </p>
                  {!searchTerm && (
                    <Button onClick={() => setIsAddDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Todo
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Todo</DialogTitle>
                <DialogDescription>
                  Update the details of your todo item.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    id="edit-title"
                    value={newTodo.title}
                    onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                    placeholder="Enter todo title..."
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={newTodo.description}
                    onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                    placeholder="Enter description (optional)..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={updateTodo}>Update Todo</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
}
