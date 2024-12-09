import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  mobile: string;

  @Prop()
  firstname: string;
  
  @Prop()
  lastname: string;

  @Prop()
  email: string;

  @Prop()
  password: string;
  
  @Prop()
  isVerify: boolean 
}

export const UserSchema = SchemaFactory.createForClass(User);
