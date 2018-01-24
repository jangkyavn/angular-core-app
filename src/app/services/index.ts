import { AuthService } from './auth.service';
import { DataService } from './data.service';
import { MessageService } from './message.service';
import { UtilityService } from './utility.service';
import { NotificationService } from './notification.service';

export const services: any[] = [AuthService, DataService, MessageService, UtilityService, NotificationService];

export * from './auth.service';
export * from './data.service';
export * from './message.service';
export * from './utility.service';
export * from './notification.service';