export class QueryBuilder {
    private whereClause: Record<string, any>;

    constructor() {
        this.whereClause = {};
    }

    addSearch(search?: string, fields: string[] = []) {
        if (search && fields.length) {
            this.whereClause.OR = fields.map((field) => ({
                [field]: { contains: search, mode: "insensitive" },
            }));
        }
        return this;
    }

    addPagination(skip?: number, limit?: number) {
        return {
            skip: skip ?? 0,
            take: limit ?? 10,
        };
    }

    getWhereClause() {
        return this.whereClause;
    }
}
