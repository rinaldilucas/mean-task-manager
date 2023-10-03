import { EStatus } from '@app/scripts/models/enum/status.enum';

export interface ITask {
  _id: string;
  title: string;
  description?: string;
  date?: Date;
  status: EStatus;
  category?: string;
  userId: string;
  createdAt: Date;
}
