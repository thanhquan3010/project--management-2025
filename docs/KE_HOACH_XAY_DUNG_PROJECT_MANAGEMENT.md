# KẾ HOẠCH XÂY DỰNG ỨNG DỤNG PROJECT MANAGEMENT
## Phân tích từ: https://github.com/GreatStackDev/project-management

---

## 📋 TỔNG QUAN DỰ ÁN

### Mô tả
Nền tảng quản lý dự án mã nguồn mở được xây dựng với ReactJS và Tailwind CSS, hỗ trợ nhiều workspace, quản lý dự án, task và thành viên team.

### Tính năng chính
1. **Multiple Workspaces**: Tạo nhiều workspace, mỗi workspace có projects, tasks và members riêng
2. **Project Management**: Quản lý projects, tasks và team members
3. **Analytics**: Xem phân tích dự án (tiến độ, tỷ lệ hoàn thành, quy mô team)
4. **Task Management**: Gán tasks cho thành viên, đặt deadline, theo dõi trạng thái
5. **User Management**: Mời thành viên, quản lý vai trò, xem hoạt động

### Tech Stack
- **Frontend Framework**: ReactJS + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: Redux Toolkit
- **UI Components**: Custom components với Tailwind

---

## 🎯 ROADMAP XÂY DỰNG (A-Z)

---

## GIAI ĐOẠN 1: SETUP & CẤU HÌNH (Ngày 1-2)

### Bước 1.1: Setup môi trường phát triển

#### Yêu cầu hệ thống
```bash
# Kiểm tra Node.js (v16+ recommended)
node --version

# Kiểm tra npm
npm --version
```

#### Tạo project với Vite
```bash
# Tạo project ReactJS với Vite
npm create vite@latest project-management -- --template react

# Di chuyển vào thư mục
cd project-management

# Cài đặt dependencies
npm install
```

### Bước 1.2: Cài đặt dependencies cần thiết

```bash
# Tailwind CSS + PostCSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Redux Toolkit + React Redux
npm install @reduxjs/toolkit react-redux

# Lucide React (Icons)
npm install lucide-react

# React Router (cho navigation)
npm install react-router-dom

# Thư viện hỗ trợ khác
npm install clsx
npm install date-fns # Xử lý date/time
npm install recharts # Cho analytics charts
npm install react-hot-toast # Notifications
```

### Bước 1.3: Cấu hình Tailwind CSS

**File: `tailwind.config.js`**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
      },
    },
  },
  plugins: [],
}
```

**File: `src/index.css`**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-gray-50 text-gray-900;
  }
}
```

### Bước 1.4: Setup cấu trúc thư mục

```
src/
├── assets/              # Hình ảnh, icons, fonts
├── components/          # React components
│   ├── common/         # Shared components
│   ├── workspace/      # Workspace related
│   ├── project/        # Project related
│   ├── task/           # Task related
│   └── user/           # User related
├── features/           # Redux slices
│   ├── workspace/
│   ├── project/
│   ├── task/
│   └── user/
├── hooks/              # Custom hooks
├── layouts/            # Layout components
├── pages/              # Page components
├── services/           # API services
├── store/              # Redux store
├── utils/              # Utility functions
├── App.jsx
└── main.jsx
```

---

## GIAI ĐOẠN 2: SETUP REDUX STORE (Ngày 2-3)

### Bước 2.1: Tạo Redux Store

**File: `src/store/index.js`**
```javascript
import { configureStore } from '@reduxjs/toolkit';
import workspaceReducer from '../features/workspace/workspaceSlice';
import projectReducer from '../features/project/projectSlice';
import taskReducer from '../features/task/taskSlice';
import userReducer from '../features/user/userSlice';

export const store = configureStore({
  reducer: {
    workspace: workspaceReducer,
    project: projectReducer,
    task: taskReducer,
    user: userReducer,
  },
});
```

### Bước 2.2: Tạo các Redux Slices

**File: `src/features/workspace/workspaceSlice.js`**
```javascript
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  workspaces: [],
  currentWorkspace: null,
  loading: false,
  error: null,
};

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    setWorkspaces: (state, action) => {
      state.workspaces = action.payload;
    },
    addWorkspace: (state, action) => {
      state.workspaces.push(action.payload);
    },
    updateWorkspace: (state, action) => {
      const index = state.workspaces.findIndex(w => w.id === action.payload.id);
      if (index !== -1) {
        state.workspaces[index] = action.payload;
      }
    },
    deleteWorkspace: (state, action) => {
      state.workspaces = state.workspaces.filter(w => w.id !== action.payload);
    },
    setCurrentWorkspace: (state, action) => {
      state.currentWorkspace = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setWorkspaces,
  addWorkspace,
  updateWorkspace,
  deleteWorkspace,
  setCurrentWorkspace,
  setLoading,
  setError,
} = workspaceSlice.actions;

export default workspaceSlice.reducer;
```

**File: `src/features/project/projectSlice.js`**
```javascript
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  projects: [],
  currentProject: null,
  loading: false,
  error: null,
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setProjects: (state, action) => {
      state.projects = action.payload;
    },
    addProject: (state, action) => {
      state.projects.push(action.payload);
    },
    updateProject: (state, action) => {
      const index = state.projects.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.projects[index] = action.payload;
      }
    },
    deleteProject: (state, action) => {
      state.projects = state.projects.filter(p => p.id !== action.payload);
    },
    setCurrentProject: (state, action) => {
      state.currentProject = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setProjects,
  addProject,
  updateProject,
  deleteProject,
  setCurrentProject,
  setLoading,
  setError,
} = projectSlice.actions;

export default projectSlice.reducer;
```

**File: `src/features/task/taskSlice.js`**
```javascript
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tasks: [],
  filteredTasks: [],
  filter: 'all', // all, pending, in-progress, completed
  loading: false,
  error: null,
};

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    setTasks: (state, action) => {
      state.tasks = action.payload;
      state.filteredTasks = action.payload;
    },
    addTask: (state, action) => {
      state.tasks.push(action.payload);
      state.filteredTasks = state.tasks;
    },
    updateTask: (state, action) => {
      const index = state.tasks.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
        state.filteredTasks = state.tasks;
      }
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter(t => t.id !== action.payload);
      state.filteredTasks = state.tasks;
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
      if (action.payload === 'all') {
        state.filteredTasks = state.tasks;
      } else {
        state.filteredTasks = state.tasks.filter(t => t.status === action.payload);
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setTasks,
  addTask,
  updateTask,
  deleteTask,
  setFilter,
  setLoading,
  setError,
} = taskSlice.actions;

export default taskSlice.reducer;
```

**File: `src/features/user/userSlice.js`**
```javascript
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: [],
  currentUser: null,
  teamMembers: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    addUser: (state, action) => {
      state.users.push(action.payload);
    },
    updateUser: (state, action) => {
      const index = state.users.findIndex(u => u.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    },
    removeUser: (state, action) => {
      state.users = state.users.filter(u => u.id !== action.payload);
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    setTeamMembers: (state, action) => {
      state.teamMembers = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setUsers,
  addUser,
  updateUser,
  removeUser,
  setCurrentUser,
  setTeamMembers,
  setLoading,
  setError,
} = userSlice.actions;

export default userSlice.reducer;
```

---

## GIAI ĐOẠN 3: XÂY DỰNG COMMON COMPONENTS (Ngày 3-5)

### Bước 3.1: Button Component

**File: `src/components/common/Button.jsx`**
```javascript
import React from 'react';
import clsx from 'clsx';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  onClick,
  className,
  type = 'button',
  ...props 
}) => {
  const baseStyles = 'font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
```

### Bước 3.2: Input Component

**File: `src/components/common/Input.jsx`**
```javascript
import React from 'react';
import clsx from 'clsx';

const Input = ({ 
  label, 
  error, 
  helperText,
  className,
  ...props 
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        className={clsx(
          'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all',
          error 
            ? 'border-red-500 focus:ring-red-500' 
            : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default Input;
```

### Bước 3.3: Card Component

**File: `src/components/common/Card.jsx`**
```javascript
import React from 'react';
import clsx from 'clsx';

const Card = ({ 
  children, 
  title, 
  actions,
  className,
  ...props 
}) => {
  return (
    <div
      className={clsx(
        'bg-white rounded-lg shadow-md overflow-hidden',
        className
      )}
      {...props}
    >
      {title && (
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {actions && <div>{actions}</div>}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default Card;
```

### Bước 3.4: Modal Component

**File: `src/components/common/Modal.jsx`**
```javascript
import React from 'react';
import { X } from 'lucide-react';
import Button from './Button';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children,
  footer,
  size = 'md'
}) => {
  if (!isOpen) return null;
  
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className={clsx(
          'inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full',
          sizes[size]
        )}>
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Body */}
          <div className="px-6 py-4">
            {children}
          </div>
          
          {/* Footer */}
          {footer && (
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
```

### Bước 3.5: Dropdown Component

**File: `src/components/common/Dropdown.jsx`**
```javascript
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';

const Dropdown = ({ 
  label, 
  options, 
  value, 
  onChange,
  placeholder = 'Select option'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const selectedOption = options.find(opt => opt.value === value);
  
  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 flex items-center justify-between"
      >
        <span className={clsx(
          selectedOption ? 'text-gray-900' : 'text-gray-500'
        )}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown size={20} className={clsx(
          'transition-transform',
          isOpen && 'transform rotate-180'
        )} />
      </button>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={clsx(
                'w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors',
                value === option.value && 'bg-primary-50 text-primary-700'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
```

### Bước 3.6: Badge Component

**File: `src/components/common/Badge.jsx`**
```javascript
import React from 'react';
import clsx from 'clsx';

const Badge = ({ 
  children, 
  variant = 'default',
  size = 'md'
}) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-primary-100 text-primary-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
  };
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };
  
  return (
    <span className={clsx(
      'inline-flex items-center font-medium rounded-full',
      variants[variant],
      sizes[size]
    )}>
      {children}
    </span>
  );
};

export default Badge;
```

---

## GIAI ĐOẠN 4: XÂY DỰNG WORKSPACE MODULE (Ngày 5-7)

### Bước 4.1: Workspace List Component

**File: `src/components/workspace/WorkspaceList.jsx`**
```javascript
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentWorkspace } from '../../features/workspace/workspaceSlice';
import { Building2, Users, FolderKanban } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';

const WorkspaceList = ({ onSelectWorkspace }) => {
  const dispatch = useDispatch();
  const { workspaces, currentWorkspace } = useSelector(state => state.workspace);
  
  const handleSelectWorkspace = (workspace) => {
    dispatch(setCurrentWorkspace(workspace));
    if (onSelectWorkspace) {
      onSelectWorkspace(workspace);
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {workspaces.map((workspace) => (
        <Card
          key={workspace.id}
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => handleSelectWorkspace(workspace)}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <Building2 className="text-primary-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{workspace.name}</h3>
                <p className="text-sm text-gray-500">{workspace.description}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FolderKanban size={16} />
              <span>{workspace.projectCount || 0} Projects</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users size={16} />
              <span>{workspace.memberCount || 0} Members</span>
            </div>
          </div>
          
          {currentWorkspace?.id === workspace.id && (
            <div className="mt-3">
              <Badge variant="primary" size="sm">Active</Badge>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};

export default WorkspaceList;
```

### Bước 4.2: Create Workspace Modal

**File: `src/components/workspace/CreateWorkspaceModal.jsx`**
```javascript
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addWorkspace } from '../../features/workspace/workspaceSlice';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import toast from 'react-hot-toast';

const CreateWorkspaceModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Workspace name is required';
    }
    return newErrors;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    const newWorkspace = {
      id: Date.now().toString(),
      ...formData,
      projectCount: 0,
      memberCount: 1,
      createdAt: new Date().toISOString(),
    };
    
    dispatch(addWorkspace(newWorkspace));
    toast.success('Workspace created successfully!');
    onClose();
    setFormData({ name: '', description: '' });
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Workspace"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Create Workspace
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Workspace Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g., My Company"
          error={errors.name}
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Brief description of this workspace"
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </form>
    </Modal>
  );
};

export default CreateWorkspaceModal;
```

---

## GIAI ĐOẠN 5: XÂY DỰNG PROJECT MODULE (Ngày 7-9)

### Bước 5.1: Project Card Component

**File: `src/components/project/ProjectCard.jsx`**
```javascript
import React from 'react';
import { Calendar, Users, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import Card from '../common/Card';
import Badge from '../common/Badge';

const ProjectCard = ({ project, onClick }) => {
  const getStatusVariant = (status) => {
    const variants = {
      'not-started': 'default',
      'in-progress': 'primary',
      'completed': 'success',
      'on-hold': 'warning',
    };
    return variants[status] || 'default';
  };
  
  const completionRate = project.completionRate || 0;
  
  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={onClick}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-lg">{project.name}</h3>
          <Badge variant={getStatusVariant(project.status)}>
            {project.status.replace('-', ' ')}
          </Badge>
        </div>
        
        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2">
          {project.description}
        </p>
        
        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-medium text-primary-600">{completionRate}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <span>
              {project.deadline ? format(new Date(project.deadline), 'MMM dd, yyyy') : 'No deadline'}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <CheckCircle2 size={16} />
              <span>{project.taskCount || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users size={16} />
              <span>{project.memberCount || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProjectCard;
```

### Bước 5.2: Create Project Modal

**File: `src/components/project/CreateProjectModal.jsx`**
```javascript
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addProject } from '../../features/project/projectSlice';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Dropdown from '../common/Dropdown';
import Button from '../common/Button';
import toast from 'react-hot-toast';

const CreateProjectModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { currentWorkspace } = useSelector(state => state.workspace);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'not-started',
    deadline: '',
  });
  const [errors, setErrors] = useState({});
  
  const statusOptions = [
    { value: 'not-started', label: 'Not Started' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'on-hold', label: 'On Hold' },
    { value: 'completed', label: 'Completed' },
  ];
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleStatusChange = (value) => {
    setFormData(prev => ({ ...prev, status: value }));
  };
  
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    }
    return newErrors;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    const newProject = {
      id: Date.now().toString(),
      ...formData,
      workspaceId: currentWorkspace?.id,
      completionRate: 0,
      taskCount: 0,
      memberCount: 1,
      createdAt: new Date().toISOString(),
    };
    
    dispatch(addProject(newProject));
    toast.success('Project created successfully!');
    onClose();
    setFormData({ name: '', description: '', status: 'not-started', deadline: '' });
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Project"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Create Project
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Project Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g., Website Redesign"
          error={errors.name}
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Brief description of the project"
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        
        <Dropdown
          label="Status"
          options={statusOptions}
          value={formData.status}
          onChange={handleStatusChange}
        />
        
        <Input
          label="Deadline"
          name="deadline"
          type="date"
          value={formData.deadline}
          onChange={handleChange}
        />
      </form>
    </Modal>
  );
};

export default CreateProjectModal;
```

---

## GIAI ĐOẠN 6: XÂY DỰNG TASK MODULE (Ngày 9-11)

### Bước 6.1: Task Board Component (Kanban Style)

**File: `src/components/task/TaskBoard.jsx`**
```javascript
import React from 'react';
import { useSelector } from 'react-redux';
import TaskColumn from './TaskColumn';

const TaskBoard = () => {
  const { tasks } = useSelector(state => state.task);
  
  const columns = [
    { id: 'pending', title: 'To Do', status: 'pending' },
    { id: 'in-progress', title: 'In Progress', status: 'in-progress' },
    { id: 'completed', title: 'Done', status: 'completed' },
  ];
  
  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {columns.map(column => (
        <TaskColumn
          key={column.id}
          title={column.title}
          status={column.status}
          tasks={getTasksByStatus(column.status)}
        />
      ))}
    </div>
  );
};

export default TaskBoard;
```

### Bước 6.2: Task Column Component

**File: `src/components/task/TaskColumn.jsx`**
```javascript
import React from 'react';
import TaskCard from './TaskCard';
import { Plus } from 'lucide-react';

const TaskColumn = ({ title, status, tasks }) => {
  const getColumnColor = (status) => {
    const colors = {
      'pending': 'bg-gray-100 border-gray-300',
      'in-progress': 'bg-blue-50 border-blue-300',
      'completed': 'bg-green-50 border-green-300',
    };
    return colors[status] || 'bg-gray-100';
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Column Header */}
      <div className={`px-4 py-3 rounded-t-lg border-t-4 ${getColumnColor(status)}`}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <span className="bg-white px-2 py-1 rounded text-sm font-medium">
            {tasks.length}
          </span>
        </div>
      </div>
      
      {/* Column Body */}
      <div className="flex-1 bg-gray-50 p-4 space-y-3 min-h-[400px] rounded-b-lg">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
        
        {/* Add Task Button */}
        <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-primary-500 hover:text-primary-500 transition-colors flex items-center justify-center gap-2">
          <Plus size={20} />
          <span>Add Task</span>
        </button>
      </div>
    </div>
  );
};

export default TaskColumn;
```

### Bước 6.3: Task Card Component

**File: `src/components/task/TaskCard.jsx`**
```javascript
import React from 'react';
import { Calendar, User, MoreVertical } from 'lucide-react';
import { format } from 'date-fns';
import Badge from '../common/Badge';

const TaskCard = ({ task }) => {
  const getPriorityVariant = (priority) => {
    const variants = {
      low: 'default',
      medium: 'warning',
      high: 'danger',
    };
    return variants[priority] || 'default';
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-medium text-gray-900 flex-1">{task.title}</h4>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreVertical size={16} />
        </button>
      </div>
      
      {/* Description */}
      {task.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}
      
      {/* Priority Badge */}
      <div className="mb-3">
        <Badge variant={getPriorityVariant(task.priority)} size="sm">
          {task.priority} priority
        </Badge>
      </div>
      
      {/* Footer */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        {task.dueDate && (
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>{format(new Date(task.dueDate), 'MMM dd')}</span>
          </div>
        )}
        
        {task.assignedTo && (
          <div className="flex items-center gap-1">
            <User size={14} />
            <span>{task.assignedTo.name}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
```

### Bước 6.4: Create Task Modal

**File: `src/components/task/CreateTaskModal.jsx`**
```javascript
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTask } from '../../features/task/taskSlice';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Dropdown from '../common/Dropdown';
import Button from '../common/Button';
import toast from 'react-hot-toast';

const CreateTaskModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { currentProject } = useSelector(state => state.project);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    dueDate: '',
  });
  const [errors, setErrors] = useState({});
  
  const statusOptions = [
    { value: 'pending', label: 'To Do' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Done' },
  ];
  
  const priorityOptions = [
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' },
  ];
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    }
    return newErrors;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    const newTask = {
      id: Date.now().toString(),
      ...formData,
      projectId: currentProject?.id,
      createdAt: new Date().toISOString(),
    };
    
    dispatch(addTask(newTask));
    toast.success('Task created successfully!');
    onClose();
    setFormData({ 
      title: '', 
      description: '', 
      status: 'pending', 
      priority: 'medium', 
      dueDate: '' 
    });
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Task"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Create Task
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Task Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., Design homepage mockup"
          error={errors.title}
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Task details and requirements"
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Dropdown
            label="Status"
            options={statusOptions}
            value={formData.status}
            onChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
          />
          
          <Dropdown
            label="Priority"
            options={priorityOptions}
            value={formData.priority}
            onChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
          />
        </div>
        
        <Input
          label="Due Date"
          name="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={handleChange}
        />
      </form>
    </Modal>
  );
};

export default CreateTaskModal;
```

---

## GIAI ĐOẠN 7: XÂY DỰNG ANALYTICS MODULE (Ngày 11-13)

### Bước 7.1: Analytics Dashboard Component

**File: `src/components/analytics/AnalyticsDashboard.jsx`**
```javascript
import React from 'react';
import { useSelector } from 'react-redux';
import { TrendingUp, Users, CheckCircle2, Clock } from 'lucide-react';
import Card from '../common/Card';
import ProjectProgressChart from './ProjectProgressChart';
import TaskStatusChart from './TaskStatusChart';

const AnalyticsDashboard = () => {
  const { projects } = useSelector(state => state.project);
  const { tasks } = useSelector(state => state.task);
  const { teamMembers } = useSelector(state => state.user);
  
  // Calculate stats
  const totalProjects = projects.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const totalTasks = tasks.length;
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const stats = [
    {
      title: 'Total Projects',
      value: totalProjects,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Team Members',
      value: teamMembers.length,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Completed Tasks',
      value: completedTasks,
      icon: CheckCircle2,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Completion Rate',
      value: `${taskCompletionRate}%`,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];
  
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                <stat.icon className={stat.color} size={24} />
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Project Progress">
          <ProjectProgressChart projects={projects} />
        </Card>
        
        <Card title="Task Status">
          <TaskStatusChart tasks={tasks} />
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
```

### Bước 7.2: Project Progress Chart

**File: `src/components/analytics/ProjectProgressChart.jsx`**
```javascript
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ProjectProgressChart = ({ projects }) => {
  const data = projects.map(project => ({
    name: project.name.length > 15 ? project.name.substring(0, 15) + '...' : project.name,
    progress: project.completionRate || 0,
  }));
  
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            angle={-45} 
            textAnchor="end" 
            height={100}
            fontSize={12}
          />
          <YAxis />
          <Tooltip />
          <Bar dataKey="progress" fill="#0ea5e9" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProjectProgressChart;
```

### Bước 7.3: Task Status Chart

**File: `src/components/analytics/TaskStatusChart.jsx`**
```javascript
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const TaskStatusChart = ({ tasks }) => {
  const statusCounts = {
    pending: tasks.filter(t => t.status === 'pending').length,
    'in-progress': tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };
  
  const data = [
    { name: 'To Do', value: statusCounts.pending, color: '#6b7280' },
    { name: 'In Progress', value: statusCounts['in-progress'], color: '#3b82f6' },
    { name: 'Completed', value: statusCounts.completed, color: '#10b981' },
  ];
  
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TaskStatusChart;
```

---

## GIAI ĐOẠN 8: XÂY DỰNG PAGES & ROUTING (Ngày 13-15)

### Bước 8.1: Setup React Router

**File: `src/App.jsx`**
```javascript
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './store';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import WorkspacePage from './pages/WorkspacePage';
import ProjectPage from './pages/ProjectPage';
import TaskPage from './pages/TaskPage';
import AnalyticsPage from './pages/AnalyticsPage';
import TeamPage from './pages/TeamPage';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/workspaces" element={<WorkspacePage />} />
            <Route path="/projects" element={<ProjectPage />} />
            <Route path="/tasks" element={<TaskPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/team" element={<TeamPage />} />
          </Routes>
        </MainLayout>
      </Router>
      <Toaster position="top-right" />
    </Provider>
  );
}

export default App;
```

### Bước 8.2: Main Layout

**File: `src/layouts/MainLayout.jsx`**
```javascript
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  FolderKanban, 
  CheckSquare, 
  BarChart3, 
  Users,
  Menu,
  X 
} from 'lucide-react';
import clsx from 'clsx';

const MainLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Workspaces', href: '/workspaces', icon: Building2 },
    { name: 'Projects', href: '/projects', icon: FolderKanban },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Team', href: '/team', icon: Users },
  ];
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={clsx(
        'fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-30',
        isSidebarOpen ? 'w-64' : 'w-20'
      )}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
          {isSidebarOpen && (
            <h1 className="text-xl font-bold text-primary-600">ProjectHub</h1>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={clsx(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                  isActive 
                    ? 'bg-primary-50 text-primary-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                <item.icon size={20} />
                {isSidebarOpen && (
                  <span className="font-medium">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>
      
      {/* Main Content */}
      <div className={clsx(
        'transition-all duration-300',
        isSidebarOpen ? 'ml-64' : 'ml-20'
      )}>
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <h2 className="text-lg font-semibold text-gray-900">
            {navigation.find(nav => nav.href === location.pathname)?.name || 'Dashboard'}
          </h2>
          
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-700 font-medium">U</span>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
```

### Bước 8.3: Home Page

**File: `src/pages/HomePage.jsx`**
```javascript
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, CheckCircle2, Clock } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const HomePage = () => {
  const { workspaces } = useSelector(state => state.workspace);
  const { projects } = useSelector(state => state.project);
  const { tasks } = useSelector(state => state.task);
  
  const recentProjects = projects.slice(0, 3);
  const recentTasks = tasks.slice(0, 5);
  
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back! 👋</h1>
        <p className="text-primary-100">Here's what's happening with your projects today.</p>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Workspaces</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{workspaces.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-blue-600" size={24} />
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Projects</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{projects.length}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="text-green-600" size={24} />
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Tasks</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {tasks.filter(t => t.status !== 'completed').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="text-orange-600" size={24} />
            </div>
          </div>
        </Card>
      </div>
      
      {/* Recent Projects */}
      <Card 
        title="Recent Projects"
        actions={
          <Link to="/projects">
            <Button variant="outline" size="sm">
              View All <ArrowRight size={16} className="ml-2" />
            </Button>
          </Link>
        }
      >
        {recentProjects.length > 0 ? (
          <div className="space-y-3">
            {recentProjects.map(project => (
              <div key={project.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{project.name}</h4>
                  <p className="text-sm text-gray-600">{project.description}</p>
                </div>
                <div className="text-sm font-medium text-primary-600">
                  {project.completionRate}%
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No projects yet. Create your first project!</p>
        )}
      </Card>
      
      {/* Recent Tasks */}
      <Card 
        title="Recent Tasks"
        actions={
          <Link to="/tasks">
            <Button variant="outline" size="sm">
              View All <ArrowRight size={16} className="ml-2" />
            </Button>
          </Link>
        }
      >
        {recentTasks.length > 0 ? (
          <div className="space-y-2">
            {recentTasks.map(task => (
              <div key={task.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <input type="checkbox" className="w-5 h-5" checked={task.status === 'completed'} readOnly />
                  <span className="text-gray-900">{task.title}</span>
                </div>
                <span className={clsx(
                  'text-xs px-2 py-1 rounded-full',
                  task.priority === 'high' && 'bg-red-100 text-red-700',
                  task.priority === 'medium' && 'bg-yellow-100 text-yellow-700',
                  task.priority === 'low' && 'bg-gray-100 text-gray-700'
                )}>
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No tasks yet. Create your first task!</p>
        )}
      </Card>
    </div>
  );
};

export default HomePage;
```

### Bước 8.4: Workspace Page

**File: `src/pages/WorkspacePage.jsx`**
```javascript
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import Button from '../components/common/Button';
import WorkspaceList from '../components/workspace/WorkspaceList';
import CreateWorkspaceModal from '../components/workspace/CreateWorkspaceModal';

const WorkspacePage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Workspaces</h1>
          <p className="text-gray-600 mt-1">Manage your workspaces and their projects</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus size={20} className="mr-2" />
          New Workspace
        </Button>
      </div>
      
      {/* Workspace List */}
      <WorkspaceList />
      
      {/* Create Modal */}
      <CreateWorkspaceModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default WorkspacePage;
```

### Bước 8.5: Task Page

**File: `src/pages/TaskPage.jsx`**
```javascript
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import Button from '../components/common/Button';
import TaskBoard from '../components/task/TaskBoard';
import CreateTaskModal from '../components/task/CreateTaskModal';

const TaskPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600 mt-1">Manage and track your tasks</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus size={20} className="mr-2" />
          New Task
        </Button>
      </div>
      
      {/* Task Board */}
      <TaskBoard />
      
      {/* Create Modal */}
      <CreateTaskModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default TaskPage;
```

---

## GIAI ĐOẠN 9: LOCAL STORAGE & DATA PERSISTENCE (Ngày 15-16)

### Bước 9.1: Create Local Storage Utility

**File: `src/utils/localStorage.js`**
```javascript
const STORAGE_KEYS = {
  WORKSPACES: 'projecthub_workspaces',
  PROJECTS: 'projecthub_projects',
  TASKS: 'projecthub_tasks',
  USERS: 'projecthub_users',
  CURRENT_WORKSPACE: 'projecthub_current_workspace',
};

export const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const loadFromLocalStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return defaultValue;
  }
};

export const removeFromLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

export const clearAllStorage = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

export { STORAGE_KEYS };
```

### Bước 9.2: Update Redux Slices with Persistence

**Thêm vào `src/store/index.js`:**
```javascript
import { configureStore } from '@reduxjs/toolkit';
import workspaceReducer from '../features/workspace/workspaceSlice';
import projectReducer from '../features/project/projectSlice';
import taskReducer from '../features/task/taskSlice';
import userReducer from '../features/user/userSlice';
import { saveToLocalStorage, STORAGE_KEYS } from '../utils/localStorage';

export const store = configureStore({
  reducer: {
    workspace: workspaceReducer,
    project: projectReducer,
    task: taskReducer,
    user: userReducer,
  },
});

// Subscribe to store changes and save to localStorage
store.subscribe(() => {
  const state = store.getState();
  saveToLocalStorage(STORAGE_KEYS.WORKSPACES, state.workspace.workspaces);
  saveToLocalStorage(STORAGE_KEYS.PROJECTS, state.project.projects);
  saveToLocalStorage(STORAGE_KEYS.TASKS, state.task.tasks);
  saveToLocalStorage(STORAGE_KEYS.USERS, state.user.users);
  saveToLocalStorage(STORAGE_KEYS.CURRENT_WORKSPACE, state.workspace.currentWorkspace);
});
```

### Bước 9.3: Load Initial Data

**Update `src/App.jsx` để load data khi khởi động:**
```javascript
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setWorkspaces, setCurrentWorkspace } from './features/workspace/workspaceSlice';
import { setProjects } from './features/project/projectSlice';
import { setTasks } from './features/task/taskSlice';
import { setUsers } from './features/user/userSlice';
import { loadFromLocalStorage, STORAGE_KEYS } from './utils/localStorage';

function App() {
  const dispatch = useDispatch();
  
  useEffect(() => {
    // Load data from localStorage
    const workspaces = loadFromLocalStorage(STORAGE_KEYS.WORKSPACES, []);
    const projects = loadFromLocalStorage(STORAGE_KEYS.PROJECTS, []);
    const tasks = loadFromLocalStorage(STORAGE_KEYS.TASKS, []);
    const users = loadFromLocalStorage(STORAGE_KEYS.USERS, []);
    const currentWorkspace = loadFromLocalStorage(STORAGE_KEYS.CURRENT_WORKSPACE);
    
    dispatch(setWorkspaces(workspaces));
    dispatch(setProjects(projects));
    dispatch(setTasks(tasks));
    dispatch(setUsers(users));
    if (currentWorkspace) {
      dispatch(setCurrentWorkspace(currentWorkspace));
    }
  }, [dispatch]);
  
  // ... rest of App component
}
```

---

## GIAI ĐOẠN 10: TESTING & OPTIMIZATION (Ngày 16-18)

### Bước 10.1: Add Sample Data for Testing

**File: `src/utils/sampleData.js`**
```javascript
export const generateSampleData = () => {
  const workspaces = [
    {
      id: '1',
      name: 'My Company',
      description: 'Main workspace for company projects',
      projectCount: 3,
      memberCount: 5,
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Personal Projects',
      description: 'Personal side projects and experiments',
      projectCount: 2,
      memberCount: 1,
      createdAt: new Date().toISOString(),
    },
  ];
  
  const projects = [
    {
      id: '1',
      workspaceId: '1',
      name: 'Website Redesign',
      description: 'Complete redesign of company website',
      status: 'in-progress',
      completionRate: 45,
      taskCount: 12,
      memberCount: 3,
      deadline: '2025-12-31',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      workspaceId: '1',
      name: 'Mobile App Development',
      description: 'New mobile application for customers',
      status: 'in-progress',
      completionRate: 25,
      taskCount: 20,
      memberCount: 4,
      deadline: '2026-03-31',
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      workspaceId: '2',
      name: 'Personal Blog',
      description: 'Build a personal blog with React',
      status: 'not-started',
      completionRate: 0,
      taskCount: 5,
      memberCount: 1,
      deadline: '2025-06-30',
      createdAt: new Date().toISOString(),
    },
  ];
  
  const tasks = [
    {
      id: '1',
      projectId: '1',
      title: 'Design homepage mockup',
      description: 'Create wireframes and mockups for the new homepage',
      status: 'completed',
      priority: 'high',
      dueDate: '2025-11-15',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      projectId: '1',
      title: 'Implement navigation menu',
      description: 'Code the responsive navigation menu',
      status: 'in-progress',
      priority: 'high',
      dueDate: '2025-11-20',
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      projectId: '1',
      title: 'Set up footer section',
      description: 'Create and style the footer with links',
      status: 'pending',
      priority: 'medium',
      dueDate: '2025-11-25',
      createdAt: new Date().toISOString(),
    },
    {
      id: '4',
      projectId: '2',
      title: 'Setup React Native project',
      description: 'Initialize and configure the mobile app project',
      status: 'completed',
      priority: 'high',
      dueDate: '2025-11-10',
      createdAt: new Date().toISOString(),
    },
    {
      id: '5',
      projectId: '2',
      title: 'Design app screens',
      description: 'Create UI designs for all app screens',
      status: 'in-progress',
      priority: 'high',
      dueDate: '2025-11-30',
      createdAt: new Date().toISOString(),
    },
  ];
  
  return { workspaces, projects, tasks };
};
```

### Bước 10.2: Performance Optimization

**Thêm React.memo cho components:**
```javascript
// Ví dụ: TaskCard.jsx
import React from 'react';

const TaskCard = React.memo(({ task }) => {
  // ... component code
});

export default TaskCard;
```

**Thêm useCallback và useMemo:**
```javascript
import React, { useCallback, useMemo } from 'react';

const TaskBoard = () => {
  const { tasks } = useSelector(state => state.task);
  
  const getTasksByStatus = useCallback((status) => {
    return tasks.filter(task => task.status === status);
  }, [tasks]);
  
  const columns = useMemo(() => [
    { id: 'pending', title: 'To Do', status: 'pending' },
    { id: 'in-progress', title: 'In Progress', status: 'in-progress' },
    { id: 'completed', title: 'Done', status: 'completed' },
  ], []);
  
  // ... rest of component
};
```

---

## GIAI ĐOẠN 11: BUILD & DEPLOYMENT (Ngày 18-20)

### Bước 11.1: Production Build

```bash
# Build cho production
npm run build

# Preview build
npm run preview
```

### Bước 11.2: Deploy lên Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Deploy production
vercel --prod
```

**Hoặc setup auto-deploy với GitHub:**
1. Push code lên GitHub
2. Connect repository với Vercel
3. Vercel tự động build và deploy

### Bước 11.3: Deploy lên Netlify

**File: `netlify.toml`**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy

# Deploy production
netlify deploy --prod
```

---

## CHECKLIST HOÀN THÀNH

### ✅ Giai đoạn Setup (Ngày 1-2)
- [ ] Tạo project với Vite
- [ ] Cài đặt dependencies
- [ ] Cấu hình Tailwind CSS
- [ ] Setup cấu trúc thư mục

### ✅ Redux Store (Ngày 2-3)
- [ ] Tạo Redux store
- [ ] Tạo workspace slice
- [ ] Tạo project slice
- [ ] Tạo task slice
- [ ] Tạo user slice

### ✅ Common Components (Ngày 3-5)
- [ ] Button component
- [ ] Input component
- [ ] Card component
- [ ] Modal component
- [ ] Dropdown component
- [ ] Badge component

### ✅ Workspace Module (Ngày 5-7)
- [ ] Workspace list
- [ ] Create workspace modal
- [ ] Workspace detail view

### ✅ Project Module (Ngày 7-9)
- [ ] Project card
- [ ] Create project modal
- [ ] Project detail page

### ✅ Task Module (Ngày 9-11)
- [ ] Task board (Kanban)
- [ ] Task card
- [ ] Create task modal
- [ ] Task filters

### ✅ Analytics (Ngày 11-13)
- [ ] Analytics dashboard
- [ ] Project progress chart
- [ ] Task status chart
- [ ] Stats cards

### ✅ Pages & Routing (Ngày 13-15)
- [ ] Setup React Router
- [ ] Main layout
- [ ] Home page
- [ ] Workspace page
- [ ] Project page
- [ ] Task page
- [ ] Analytics page

### ✅ Data Persistence (Ngày 15-16)
- [ ] LocalStorage utilities
- [ ] Save data automatically
- [ ] Load data on startup

### ✅ Testing & Optimization (Ngày 16-18)
- [ ] Add sample data
- [ ] Performance optimization
- [ ] Responsive testing
- [ ] Browser compatibility

### ✅ Deployment (Ngày 18-20)
- [ ] Production build
- [ ] Deploy to hosting
- [ ] Test production app

---

## 📝 NOTES QUAN TRỌNG

### 1. Phát triển theo từng module
- Hoàn thành 1 module rồi mới chuyển sang module tiếp theo
- Test kỹ trước khi tiếp tục

### 2. State Management
- Sử dụng Redux Toolkit để quản lý state global
- Local state cho UI components đơn giản

### 3. Styling Guidelines
- Sử dụng Tailwind CSS utility classes
- Tạo custom classes khi cần thiết
- Đảm bảo responsive design

### 4. Code Organization
- Component nhỏ, tái sử dụng được
- Logic tách riêng khỏi UI
- Comments cho code phức tạp

### 5. Git Workflow
```bash
# Commit thường xuyên
git add .
git commit -m "feat: add workspace module"
git push origin main
```

---

## 🚀 BƯỚC TIẾP THEO

Sau khi hoàn thành cơ bản, bạn có thể mở rộng:

1. **Backend Integration**
   - Setup REST API hoặc GraphQL
   - Authentication & Authorization
   - Real-time updates với WebSocket

2. **Advanced Features**
   - Drag & drop tasks
   - File attachments
   - Comments & mentions
   - Notifications
   - Email integration

3. **Mobile App**
   - React Native version
   - Progressive Web App

4. **Advanced Analytics**
   - Time tracking
   - Productivity reports
   - Team performance metrics

---

## 📚 TÀI LIỆU THAM KHẢO

- [React Documentation](https://react.dev)
- [Redux Toolkit](https://redux-toolkit.js.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite](https://vitejs.dev)
- [Lucide Icons](https://lucide.dev)

---

**Chúc bạn thành công với dự án! 🎉**
