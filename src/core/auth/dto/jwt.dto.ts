import { Field, ObjectType } from '@nestjs/graphql';

export interface TokenFingerprintPair {
    token: string;
    fingerprint: string;
}

export interface RefreshPayload {
    fingerprint: string;
    username: string;
    // todo: add permissions/roles
}

export interface FullRefreshPayload extends RefreshPayload {
    subject: string;
}

export interface AccessPayload {
    username: string;
    restricted?: boolean;
}

export interface FullAccessPayload extends AccessPayload {
    iat: Date;
    exp: Date;
    sub: string;
}

@ObjectType()
export class JwtTokenPair {
    @Field()
    public access: string;

    @Field()
    public refresh: string;
}
