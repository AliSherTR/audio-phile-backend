export class Product {
    constructor(
        public readonly id: number,
        public name: string,
        public price: number,
        public description: string,
        public features: string,
        public category: "HEADPHONES" | "EARPHONES" | "SPEAKERS",
        public isPromoted: boolean = false,
        public isFeatured: boolean = false,
        public accessories: string[] = [],
        public image: string | null = null,
        public stock: number
    ) {}

    promote() {
        this.isPromoted = true;
    }

    feature() {
        this.isFeatured = true;
    }

    updateStock(quantity: number) {
        this.stock = quantity;
    }
}
