import { Injectable, NotFoundException } from '@nestjs/common';
import { TasksRepository } from './tasks.repository';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTasksFilter } from './dto/get-tasks-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './dto/task.entity';
@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository,
  ) {}
  getTasks(filterDto: GetTasksFilter): Promise<Task[]> {
    return this.tasksRepository.getTasks(filterDto);
  }

  async getTask(id: string): Promise<Task> {
    const found = await this.tasksRepository.findOne(id);
    if (!found) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    return found;
  }
  createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto);
  }
  async updateTask(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    let task = await this.getTask(id);
    task = { ...task, ...updateTaskDto };
    await this.tasksRepository.save(task);
    return task;
  }
  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    let task = await this.getTask(id);
    console.log(task);
    task.status = status;
    await this.tasksRepository.save(task);
    return task;
  }
  async deleteTask(id: string): Promise<void> {
    const result = await this.tasksRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
  }
}
