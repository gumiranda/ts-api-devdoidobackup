export class QueryBuilder {
  private readonly query = [];
  match(data: object): QueryBuilder {
    this.query.push({ $match: data });
    return this;
  }
  group(data: object): QueryBuilder {
    this.query.push({ $group: data });
    return this;
  }
  count(data: string): QueryBuilder {
    this.query.push({ $count: data });
    return this;
  }
  geoNear(data: object): QueryBuilder {
    this.query.push({ $geoNear: data });
    return this;
  }
  project(data: object): QueryBuilder {
    this.query.push({ $project: data });
    return this;
  }
  skip(data: number): QueryBuilder {
    this.query.push({ $skip: data });
    return this;
  }
  limit(data: number): QueryBuilder {
    this.query.push({ $limit: data });
    return this;
  }
  addFields(data: object): QueryBuilder {
    this.query.push({ $addFields: data });
    return this;
  }
  lookup(data: object): QueryBuilder {
    this.query.push({ $lookup: data });
    return this;
  }
  sort(data: object): QueryBuilder {
    this.query.push({
      $sort: data,
    });
    return this;
  }
  unwind(data: object): QueryBuilder {
    this.query.push({ $unwind: data });
    return this;
  }
  build(): object[] {
    return this.query;
  }
}
