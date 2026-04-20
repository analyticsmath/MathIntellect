import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * JWT Auth Guard — protects routes requiring a valid Bearer token.
 * Full implementation added in auth step; scaffolded here for import availability.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
