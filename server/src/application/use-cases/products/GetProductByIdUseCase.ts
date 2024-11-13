import { Product } from "../../../domain/entities/Product";
import { IProductRepository } from "../../../domain/repositories/IProductRepository";

export class GetProductByIdUseCase {
    constructor(private productRepository: IProductRepository) {}

    async execute(id: number): Promise<Product | null> {
        const product = this.productRepository.findById(id);

        if (!product) {
            throw new Error("Product Not found");
        }

        return product;
    }
}
