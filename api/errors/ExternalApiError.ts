import { AppError } from './AppError';

export class ExternalApiError extends AppError {
  readonly statusCode = 502;
  readonly code = 'EXTERNAL_API_ERROR';

  constructor(service: string, originalMessage?: string) {
    super(
      `Failed to communicate with ${service}${originalMessage ? `: ${originalMessage}` : ''}`
    );
  }
}
