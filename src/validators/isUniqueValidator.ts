import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidatorOptions,
  registerDecorator,
} from "class-validator";
import { appDataSource } from "../database/data-source";
import { Not } from "typeorm";

@ValidatorConstraint({ async: true })
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  public defaultMessage(): string {
    return `$property is already in use`;
  }

  async validate(value: any, args: ValidationArguments): Promise<boolean> {
    const [entity, field] = args.constraints;

    const repository = appDataSource.getRepository(entity);
    // Check if request is an update
    const isUpdate: boolean = args.object["id"] !== undefined; // Check if the request has an id param

    let count = 0;

    // if not update
    if (!isUpdate) {
      count = await repository.count({ where: { [field]: value } });
    }
    // If update request, ignore the provided update
    else {
      count = await repository.count({
        where: { [field]: value, id: Not(args.object["id"]) },
      });
    }

    return count <= 0;
  }
}

export function IsUnique(
  entity: any,
  field: string,
  validationOptions?: ValidatorOptions
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [entity, field],
      validator: IsUniqueConstraint,
    });
  };
}
