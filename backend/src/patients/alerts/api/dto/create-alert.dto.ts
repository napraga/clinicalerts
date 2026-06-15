import { IsEnum, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { AlertType } from '../../domain/value-objects/alert-type.vo';
import { Severity } from '../../domain/value-objects/severity.vo';

export class CreateAlertDto {
    @IsEnum(AlertType, {
        message: `type debe ser uno de: ${Object.values(AlertType).join(', ')}`,
    })
    type: AlertType;

    @IsEnum(Severity, {
        message: `severity debe ser uno de: ${Object.values(Severity).join(', ')}`,
    })
    severity: Severity;

    @IsString()
    @IsNotEmpty({ message: 'El mensaje no puede estar vacío' })
    @MinLength(3, { message: 'El mensaje debe tener al menos 3 caracteres' })
    @MaxLength(500, { message: 'El mensaje no puede superar los 500 caracteres' })
    message: string;
}