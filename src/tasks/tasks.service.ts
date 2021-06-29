import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.models';
import { v1 as uuidv1 } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTasksFilter } from './dto/get-tasks-filter.dto';
@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksFilter(filterDto: GetTasksFilter): Task[] {
    const { status, search } = filterDto;
    let tasks: Task[] = [];

    if (status) {
      tasks = this.tasks.filter((task) => task.status === status);
    }

    if (search) {
      tasks = this.tasks.filter(
        (task) =>
          task.title.includes(search) || task.description.includes(search),
      );
    }

    return tasks;
  }

  getTask(id: string): Task {
    const found =  this.tasks.find((tasks) => tasks.id === id);
    if (!found) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    return found;
  }

  createTask(CreateTaskDto: CreateTaskDto): Task {
    const { title, description } = CreateTaskDto;
    const task: Task = {
      id: uuidv1(),
      title,
      description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task);
    return task;
  }

  updateTask(id, UpdateTaskDto: UpdateTaskDto): Task {
    const idx = this.tasks.findIndex((task) => task.id === id);
    const { title, description } = UpdateTaskDto;
    this.tasks[idx] = {
      id,
      title,
      description,
      status: TaskStatus.IN_PROGRESS,
    };
    return this.tasks[idx];
  }

  updateTaskStatus(id: string, status: TaskStatus): Task {
    let task = this.getTask(id);
    task.status = status;
    return task;
  }

  deleteTask(id: string): void {
    const found = this.getTask(id);
    this.tasks = this.tasks.filter((tasks) => tasks.id !== found.id);
  }
}
