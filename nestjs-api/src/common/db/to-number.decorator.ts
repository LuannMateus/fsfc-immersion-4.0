import { addAttributeOptions } from 'sequelize-typescript';

export function ToNumber(targe: any, propertyKey: string): any {
  addAttributeOptions(targe, propertyKey, {
    get(): any {
      return +this.getDataValue(propertyKey);
    },
  });
}
