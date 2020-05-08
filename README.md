[![npm version](https://badge.fury.io/js/mongoose-paginate-ts.svg)](https://badge.fury.io/js/mongoose-paginate-ts)

# mongoose-paginate-ts

Typescript pagination plugin for [Mongoose](http://mongoosejs.com)

[![NPM](https://nodei.co/npm/mongoose-paginate-ts.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/mongoose-paginate-ts)

## Installation

```sh
npm install mongoose-paginate-ts
```

## Usage

Add plugin for a mongoose schema to inject a `paginate` method for pagination:

```ts
import { mongoosePagination, Pagination } from "mongoose-paginate-ts";
type User = mongoose.Document & {
  username: String,
  accounts: [mongoose.Types.ObjectId]
};
const userSchema = new Schema({
  username: String,
  accounts: [{ type: ObjectId, ref: "Account" }]
});
userSchema.plugin(mongoosePagination);
const User: Pagination<User> = mongoose.model<User, Pagination<User>>("User", userSchema);

//User.paginate()
```

### Model.paginate([options], [callback])

#### **Parameters**

- `[options]` {Object}
  - `[query]` {Object} - Query conditions. [Documentation](https://docs.mongodb.com/manual/tutorial/query-documents/)
  - `[select]` {Object | String} - Fields to return (by default returns all fields). [Documentation](http://mongoosejs.com/docs/api.html#query_Query-select)
  - `[sort]` {Object | String} - Sort order. [Documentation](http://mongoosejs.com/docs/api.html#query_Query-sort)
  - `[populate]` {Object | String} - Paths which should be populated with other documents. [Documentation](http://mongoosejs.com/docs/api.html#query_Query-populate)
  - `[page=1]` {Number}, 
  - `[limit=10]` {Number}, number of docs per page, default is 10
- `[callback(err, result)]` - The callback is called once pagination results are retrieved or when an error has occurred

#### Result value

Promise fulfilled with an Pagination:

```ts
interface Pagination {
  docs: T[];
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
  limit: number;
  pagingCounter: number;
  page: number | null;
  totalPages: number;
}
```

### Examples

#### Paginate with

```ts
User.paginate({}).then((error: Error, result: any) => {
  // ...
});
```

#### More advanced example

```ts
var options = {
  query: {},
  select: "title date author",
  sort: { date: -1 },
  populate: "account",
  limit: 5
};

User.paginate(conditions, options).then((error: Error, result: any) => {
  // ...
});
```

## License

[MIT](LICENSE)