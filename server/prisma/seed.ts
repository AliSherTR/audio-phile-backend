import { db } from "../src/db";
import { Category } from "@prisma/client";
async function main() {
    const items = Array.from({ length: 30 }).map((_, index) => ({
        name: `XX99 Mark II ${index + 1}`, // Ensure unique names
        price: 2999,
        description:
            "The new XX99 Mark II headphones is the pinnacle of pristine audio. It redefines your premium headphone experience by reproducing the balanced depth and precision of studio-quality sound.",
        accessories: [
            "Headphone unit",
            "Replacement earcups",
            "User manual",
            "3.5mm 5m audio cable",
            "Travel bag",
        ],
        features:
            "Featuring a genuine leather head strap and premium earcups, these headphones deliver superior comfort for those who like to enjoy endless listening. It includes intuitive controls designed for any situation. Whether you’re taking a business call or just in your own personal space, the auto on/off and pause features ensure that you’ll never miss a beat. The advanced Active Noise Cancellation with built-in equalizer allow you to experience your audio world on your terms. It lets you enjoy your audio in peace, but quickly interact with your surroundings when you need to. Combined with Bluetooth 5.0 compliant connectivity and 17 hour battery life, the XX99 Mark II headphones gives you superior sound, cutting-edge technology, and a modern design aesthetic.",
        category: Category.HEADPHONES,
        stock: index + 13,
        image: "test image",
        isFeatured: false,
    }));

    const users = Array.from({ length: 30 }).map((_, index) => ({
        name: "Ali Sher Khan",
        email: `example${index}@gmail.com`,
        password: "Khan12345",
        image: "example-image",
    }));

    try {
        // await db.product.createMany({ data: items });
        await db.users.createMany({ data: users });
        console.log("Seeding completed.");
    } catch (error) {
        console.error("Error seeding items:", error);
    } finally {
        await db.$disconnect();
    }
}

main();
