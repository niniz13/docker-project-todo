import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Paper,
  Box,
} from '@mui/material';
import { Delete, Edit, Save, Cancel } from '@mui/icons-material';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.common['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,PATCH,OPTIONS';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/`);
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const handleAddTodo = async () => {
    if (!newTodo.trim()) return;
    try {
      const response = await axios.post(`${API_URL}/api/create/`, {
        title: newTodo,
        completed: false,
      });
      setTodos([...todos, response.data]);
      setNewTodo('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/delete/${id}/`);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleEditStart = (todo) => {
    setEditingId(todo.id);
    setEditingText(todo.title);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditingText('');
  };

  const handleEditSave = async (id) => {
    if (!editingText.trim()) return;
    try {
      const response = await axios.put(`${API_URL}/api/edit/${id}/`, {
        title: editingText,
        completed: todos.find((todo) => todo.id === id).completed,
      });
      setTodos(todos.map((todo) => (todo.id === id ? response.data : todo)));
      setEditingId(null);
      setEditingText('');
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  return (
    <Container maxWidth='sm' sx={{ mt: 4 }}>
      <Typography variant='h4' component='h1' gutterBottom align='center'>
        Todo App
      </Typography>
      <Box sx={{ mb: 4, display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          variant='outlined'
          placeholder='Add a new todo'
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
        />
        <Button variant='contained' onClick={handleAddTodo}>
          Add
        </Button>
      </Box>
      <Paper elevation={2}>
        <List>
          {todos.map((todo) => (
            <ListItem
              key={todo.id}
              dense
              button
              sx={{
                textDecoration: todo.completed ? 'line-through' : 'none',
                opacity: todo.completed ? 0.7 : 1,
              }}
            >
              {editingId === todo.id ? (
                <Box sx={{ display: 'flex', gap: 1, flex: 1 }}>
                  <TextField
                    fullWidth
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === 'Enter' && handleEditSave(todo.id)
                    }
                    autoFocus
                  />
                  <IconButton
                    onClick={() => handleEditSave(todo.id)}
                    color='primary'
                  >
                    <Save />
                  </IconButton>
                  <IconButton onClick={handleEditCancel} color='error'>
                    <Cancel />
                  </IconButton>
                </Box>
              ) : (
                <>
                  <ListItemText primary={todo.title} />
                  <ListItemSecondaryAction>
                    <IconButton
                      onClick={() => handleEditStart(todo)}
                      color='primary'
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteTodo(todo.id)}
                      color='error'
                    >
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </>
              )}
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
}

export default App;
