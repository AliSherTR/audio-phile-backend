import { Prisma, PrismaClient } from "@prisma/client";
import { IProductRepository } from "../../domain/repositories/IProductRepository";
import { Product } from "../../domain/entities/Product";

export class PrismaProductRepository implements IProductRepository {
    constructor(private prisma: PrismaClient) {}

    async findAll(
        skip: number,
        limit: number,
        search?: string
    ): Promise<[Product[], number]> {
        const whereClause: Prisma.ProductWhereInput = search
            ? {
                  OR: [
                      { name: { contains: search, mode: "insensitive" } },
                      {
                          description: {
                              contains: search,
                              mode: "insensitive",
                          },
                      },
                  ],
              }
            : {};

        const [products, totalItems] = await Promise.all([
            this.prisma.product.findMany({
                where: whereClause,
                skip,
                take: limit,
                orderBy: { id: "asc" },
            }),
            this.prisma.product.count({ where: whereClause }),
        ]);

        return [products.map(this.toDomainProduct), totalItems];
    }

    async findById(id: number): Promise<Product | null> {
        const product = await this.prisma.product.findFirst({
            where: {
                id,
            },
        });

        if (!product) {
            throw new Error("No Product Found");
        }

        return this.toDomainProduct(product);
    }
    async create(product: Omit<Product, "id">): Promise<Product> {
        const prismaProduct = await this.prisma.product.create({
            data: this.toPrismaProduct(product),
        });
        return this.toDomainProduct(prismaProduct);
    }

    async update(id: number, product: Product): Promise<Product> {
        const [existingProduct, updatedProduct] =
            await this.prisma.$transaction([
                this.prisma.product.findUnique({
                    where: { id },
                }),
                this.prisma.product.update({
                    where: { id },
                    data: this.toPrismaProduct(product),
                }),
            ]);

        if (!existingProduct) {
            throw new Error("No Product found");
        }

        return this.toDomainProduct(updatedProduct);
    }

    async delete(id: number): Promise<void> {
        await this.prisma.product.delete({
            where: {
                id,
            },
        });
    }

    async findFeatured(): Promise<Product[]> {
        const featuredProducts = await this.prisma.product.findMany({
            where: {
                isFeatured: true,
            },
        });

        if (!featuredProducts) {
            throw new Error("No Featured Products for now");
        }
        return featuredProducts.map(this.toDomainProduct);
    }

    async findPromoted(): Promise<Product | null> {
        const promotedProduct = await this.prisma.product.findMany({
            where: {
                isFeatured: true,
            },
        });

        if (!promotedProduct) {
            throw new Error("No Featured Products for now");
        }
        return this.toDomainProduct(promotedProduct);
    }

    private toPrismaProduct(
        product: Omit<Product, "id">
    ): Prisma.ProductCreateInput {
        return {
            name: product.name,
            price: product.price,
            description: product.description,
            features: product.features,
            category: product.category,
            isPromoted: product.isPromoted,
            isFeatured: product.isFeatured,
            accessories: product.accessories,
            image: product.image || "",
            stock: product.stock,
        };
    }

    private toDomainProduct(prismaProduct: any): Product {
        return new Product(
            prismaProduct.id,
            prismaProduct.name,
            prismaProduct.price,
            prismaProduct.description,
            prismaProduct.features,
            prismaProduct.category,
            prismaProduct.isPromoted,
            prismaProduct.isFeatured,
            prismaProduct.accessories,
            prismaProduct.image ?? null,
            prismaProduct.stock
        );
    }
}
