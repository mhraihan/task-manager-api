import { User } from 'src/auth/entities/user.entity';
import { Brackets, EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilter } from './dto/get-tasks-filter.dto';
import { Task } from './dto/task.entity';
import { TaskStatus } from './task-status.enum';
import { InternalServerErrorException, Logger } from '@nestjs/common';
@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {
  private log: Logger = new Logger('TasksRepository', true);
  async getTasks(filterDto: GetTasksFilter, user: User): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task'); // here task is entity
    query.where({ user });
    if (status) {
      query.andWhere('status = :status', { status });
    }
    if (search) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('title ILIKE :search OR description ILIKE :search', {
            search: `%${search}%`,
          });
        }),
      );
    }

    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (e) {
      this.log.error(e.message, e.stack);
      throw new InternalServerErrorException();
    }
  }
  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });
    await this.save(task);
    return task;
  }
}
