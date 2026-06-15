import {
    IsBoolean,
    IsEnum,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';
import { Severity } from '../../domain/value-objects/severity.vo';

export class UpdateAlertDto {
    @IsOptional()
    @IsEnum(Severity, {
        message: `severity debe ser uno de: ${Object.values(Severity).join(', ')}`,
    })
    severity?: Severity;

    @IsOptional()
    @IsString()
    @MinLength(3)
    @MaxLength(500)
    message?: string;

    @IsOptional()
    @IsBoolean({ message: 'isActive debe ser un booleano' })
    isActive?: boolean;
}