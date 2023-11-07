import { EStatus } from '@app/scripts/models/enums/status.enum';

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
