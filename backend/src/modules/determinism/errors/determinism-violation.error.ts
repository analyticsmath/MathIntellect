import { ConflictException } from '@nestjs/common';

export class DeterminismViolationError extends ConflictException {
  constructor(simulationId: string, expectedHash: string, actualHash: string) {
    super({
      message:
        'Determinism violation detected: replay output does not match original output.',
      simulationId,
      expectedHash,
      actualHash,
      code: 'DETERMINISM_VIOLATION',
    });
  }
}
