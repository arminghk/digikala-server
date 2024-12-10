import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Types } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema()
export class Category {
    @Prop()
    title: string;
    @Prop({nullable: true})
    priority: number
    // @Prop(() => BlogCategoryEntity, blog => blog.category)
    // blog_categories: BlogCategoryEntity[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);