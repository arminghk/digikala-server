import { Injectable,ConflictException,NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './model/category.schema';
import { Model } from 'mongoose';
import { ConflictMessage, NotFoundMessage, PublicMessage } from 'src/common/enums/message.enum';
import { paginationGenerator, paginationSolver } from 'src/common/utils/pagination.util';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ){}
  async create(createCategoryDto: CreateCategoryDto) {
    let { priority, title } = createCategoryDto;
    title = await this.checkExistAndResolveTitle(title);
    const category = await this.categoryModel.create({
      title,
      priority
    });
  
    return {
      category,
      message: PublicMessage.Created
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit, page, skip } = paginationSolver(paginationDto);
  

    const categories = await this.categoryModel
      .find()  
      .skip(skip) 
      .limit(limit) 
      .exec() 
  
    const count = await this.categoryModel.countDocuments();
  
    return {
      pagination: paginationGenerator(count, page, limit),
      categories
    };
  }
  async findOne(id: string) {
    const category = await this.categoryModel.findById( id );
    if (!category) throw new NotFoundException(NotFoundMessage.NotFoundCategory);
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {

    const { priority, title } = updateCategoryDto;
    const updatedCategory = await this.categoryModel.findByIdAndUpdate(
      id, 
      { title, priority }, 
      { new: true, omitUndefined: true } 
    );
    if (!updatedCategory) {
      throw new NotFoundException('دسته‌بندی یافت نشد.');
    }
  
    return {
      message: PublicMessage.Updated,
      category: updatedCategory,
    };
  }
  async remove(id: string) {
    await this.findOne(id);
    await this.categoryModel.deleteOne({ _id: id });
    return {
      message: PublicMessage.Deleted
    }
  }


  async checkExistAndResolveTitle(title: string) {
    title = title?.trim()?.toLowerCase();
    const category = await this.categoryModel.findOne({ title });
    if (category) throw new ConflictException(ConflictMessage.CategoryTitle);
    return title;
  }
}
