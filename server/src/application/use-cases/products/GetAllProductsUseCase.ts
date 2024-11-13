import { IProductRepository } from "../../../domain/repositories/IProductRepository";
import { Product } from "../../../domain/entities/Product";

export class GetAllProductsUseCase {
    constructor(private productRepository: IProductRepository) {}

    async execute(
        page: number,
        limit: number,
        search?: string
    ): Promise<{
        products: Product[];
        totalItems: number;
        totalPages: number;
        currentPage: number;
        pageSize: number;
    }> {
        const skip = (page - 1) * limit;
        const [products, totalItems] = await this.productRepository.findAll(
            skip,
            limit,
            search
        );
        const totalPages = Math.ceil(totalItems / limit);

        return {
            products,
            totalItems,
            totalPages,
            currentPage: page,
            pageSize: limit,
        };
    }
}
