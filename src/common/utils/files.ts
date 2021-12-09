import { join } from 'path';
import { existsSync } from 'fs';

export function pathTo(relativePath: string): string {
    const dist = join(process.cwd(), 'dist', relativePath);
    if (existsSync(dist)) return dist;
    return join(process.cwd(), 'src', relativePath);
}
