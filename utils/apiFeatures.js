class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filtering() {
    const queryObj = { ...this.queryString };
    const exceptions = ["sort", "fields", "page", "limit"];
    exceptions.forEach((exception) => delete queryObj[exception]);

    const queryStr = JSON.parse(
      JSON.stringify(queryObj).replace(
        /\b(lt|lte|gt|gte|ne)\b/g,
        (match) => `$${match}`
      )
    );

    this.query = this.query.find(queryStr);

    return this;
  }

  sorting() {
    this.query = this.query.sort
      ? this.query.sort(this.queryString.sort?.split(",").join(" ").trim())
      : this.query.sort("-date");

    return this;
  }

  pagination() {
    const page = +this.queryString.page ?? 1;
    const limit = +this.queryString.limit ?? 10;
    const skip = (page - 1) * process.env.RESULTS_PER_PAGE;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }

  limitingFields() {
    this.query = this.queryString.fields
      ? this.query.select(this.queryString.fields?.split(",").join(" ").trim())
      : this.query.select("-__v");

    return this;
  }
}

export default APIFeatures;
