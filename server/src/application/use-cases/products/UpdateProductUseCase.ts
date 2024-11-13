import { Product } from "../../../domain/entities/Product";
import { IProductRepository } from "../../../domain/repositories/IProductRepository";

export class UpdateProductUseCase {
    constructor(private productRepository: IProductRepository) {}

    async execute(id: number, productData: Product): Promise<Product> {
        const existingProduct = this.productRepository.findById(id);
        if (!existingProduct) {
            throw new Error("Product not found");
        }

        const updatedProduct = await this.productRepository.update(
            id,
            productData
        );

        return updatedProduct;
    }
}
