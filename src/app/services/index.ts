import { AuthService } from './auth.service';
import { DataService } from './data.service';
import { MessageService } from './message.service';
import { NotificationService } from './notification.service';
import { UtilityService } from './utility.service';
import { UploadService } from './upload.service';

export const services: any[] = [
    AuthService,
    DataService,
    MessageService,
    NotificationService,
    UtilityService,
    UploadService];

export * from './auth.service';
export * from './data.service';
export * from './message.service';
export * from './notification.service';
export * from './utility.service';
export * from './upload.service';