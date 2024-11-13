import { Product } from "../../../domain/entities/Product";
import { IProductRepository } from "../../../domain/repositories/IProductRepository";
import { CreateProductDTO } from "../../../infrastructure/validation/ProductValidationSchema";

export class CreateProductUseCase {
    constructor(private productRepository: IProductRepository) {}
    async execute(productData: CreateProductDTO): Promise<Product> {
        const product = new Product(
            0, // temporary id, will be replaced by the database
            productData.name,
            productData.price,
            productData.description,
            productData.features,
            productData.category,
            productData.isPromoted,
            productData.isFeatured,
            productData.accessories || [],
            productData.image || null,
            productData.stock
        );

        return await this.productRepository.create(product);
    }
}
