import { EStatus } from '@api/shared/enum/status.enum';

export interface TaskInterface {
  title: string;
  description?: string;
  date?: Date;
  status: EStatus;
  category?: string;
  userId: string;
}
