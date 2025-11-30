import { AppError } from './AppError';

export class NotFoundError extends AppError {
  readonly statusCode = 404;
  readonly code = 'NOT_FOUND';

  constructor(resource: string, id?: string | number) {
    super(id ? `${resource} with ID ${id} not found` : `${resource} not found`);
  }
}
