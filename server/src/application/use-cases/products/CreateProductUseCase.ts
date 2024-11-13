import { Product } from "../../../domain/entities/Product";
import { IProductRepository } from "../../../domain/repositories/IProductRepository";

export class CreateProductUseCase {
    constructor(private productRepository: IProductRepository) {}

    async execute(productData: Omit<Product, "id">): Promise<Product> {
        return await this.productRepository.create(productData);
    }
}
