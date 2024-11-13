import { Product } from "../entities/Product";

export interface IProductRepository {
    findAll(
        skip: number,
        limit: number,
        search?: string
    ): Promise<[Product[], number]>;
    findById(id: number): Promise<Product | null>;
    create(product: Omit<Product, "id">): Promise<Product>;
    update(id: number, product: Product): Promise<Product>;
    delete(id: number): Promise<void>;
    findFeatured(): Promise<Product[]>;
    findPromoted(): Promise<Product | null>;
}
