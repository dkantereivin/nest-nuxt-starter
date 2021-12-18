import { Injectable, Logger } from '@nestjs/common';
import { Subject } from 'rxjs';

@Injectable()
export class LifecycleService {
    public logger = new Logger('LifecycleManager');
    /*
    shutdownListener$: Currently used to activate shutdown functionality.
    This could be replaced by simpling calling setup(app.close) in the main.ts file,
    which assigns a variable here, and then calling that in shutdown().
     */
    private shutdownListener$: Subject<void> = new Subject();

    // onModuleDestroy(): void {
    //     this.logger.log('OnDestroy hook: application shutdown started.');
    // }

    subscribeToShutdown(callback: () => void): void {
        this.shutdownListener$.subscribe(callback);
    }

    public shutdown() {
        this.shutdownListener$.next();
    }
}
