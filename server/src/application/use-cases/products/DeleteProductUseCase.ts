import { IProductRepository } from "../../../domain/repositories/IProductRepository";

export class DeleteProductUseCase {
    constructor(private productRepository: IProductRepository) {}

    async execute(id: number) {
        this.productRepository.delete(id);
    }
}
