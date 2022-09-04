import { Field, ObjectType } from '@nestjs/graphql';

export enum TokenType {
    ACCESS = 'A',
    REFRESH = 'R'
}

export interface TokenFingerprintPair {
    token: string;
    fingerprint: string;
}

export interface RefreshPayload {
    t: TokenType.REFRESH;
    fingerprint: string;
    username: string;
    // todo: add permissions/roles
}

export interface FullRefreshPayload extends RefreshPayload {
    subject: string;
}

export interface AccessPayload {
    t: TokenType.ACCESS;
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
