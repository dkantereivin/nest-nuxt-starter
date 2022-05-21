import { SetMetadata } from '@nestjs/common';

export const ALLOW_RESTRICTED_METADATA = 'auth:allowRestricted';
export const AllowRestricted = () => SetMetadata(ALLOW_RESTRICTED_METADATA, true);
