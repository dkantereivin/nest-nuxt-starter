import { Subject } from './subject.decorator';
import { FullUserPipe } from '@/core/auth/pipes/full-user.pipe';

export const FullUser = () => Subject(FullUserPipe);
