import { Schema } from "mongoose";
import mongoose, { Model } from "mongoose";

export interface Pagination<T extends mongoose.Document> extends Model<T> {
  paginate(options?: any | undefined, callback?: Function | undefined): void
}
export function mongoosePagination(schema: Schema) {
  schema.statics.paginate = async function paginate(options: any | undefined, callback: Function | undefined) {
    //MARK: INIT
    let query = options.query || {};
    let populate = options.populate ?? false
    let select = options.select ?? ''
    let sort = options.sort ?? {}
    let pagination = options.pagination ?? true
    //MARK: PAGING
    const limit = parseInt(options.limit, 10) > 0 ? parseInt(options.limit, 10) : 0;
    let page = 1;
    let skip = 0;
    if (options.hasOwnProperty('page')) {
      page = parseInt(options.page, 10);
      skip = (page - 1) * limit;
    }
    //MARK: COUNTING
    let countPromise = this.countDocuments(query).exec();
    //MARK: QUERY
    let docsPromise = [];
    if (limit) {
      const mQuery = this.find(query);
      mQuery.select(select);
      mQuery.sort(sort);
      mQuery.lean();
      if (populate) {
        mQuery.populate(populate);
      }
      if (pagination) {
        mQuery.skip(skip);
        mQuery.limit(limit);
      }
      docsPromise = mQuery.exec();
    }
    //MARK: PERFORM
    try {
      let values = await Promise.all([countPromise, docsPromise]);
      const [count, docs] = values;
      const meta: any = {
        'totalDocs': count
      };
      const pages = (limit > 0) ? (Math.ceil(count / limit) || 1) : 0;
      meta['limit'] = count;
      meta['totalPages'] = 1;
      meta['page'] = page;
      meta['pagingCounter'] = ((page - 1) * limit) + 1;
      meta['hasPrevPage'] = false;
      meta['hasNextPage'] = false;
      meta['prevPage'] = null;
      meta['nextPage'] = null;
      if (pagination) {
        meta['limit'] = limit;
        meta['totalPages'] = pages;
        // Set prev page
        if (page > 1) {
          meta['hasPrevPage'] = true;
          meta['prevPage'] = (page - 1);
        }
        else if (page == 1) {
          meta['prevPage'] = null;
        }
        else {
          meta['prevPage'] = null;
        }
        // Set next page
        if (page < pages) {
          meta['hasNextPage'] = true;
          meta['nextPage'] = (page + 1);
        }
        else {
          meta['nextPage'] = null;
        }
      }
      if (limit == 0) {
        meta['limit'] = 0;
        meta['totalPages'] = null;
        meta['page'] = null;
        meta['pagingCounter'] = null;
        meta['prevPage'] = null;
        meta['nextPage'] = null;
        meta['hasPrevPage'] = false;
        meta['hasNextPage'] = false;
      }
      meta['docs'] = docs
      if (callback != undefined) {
        callback(null, meta);
      }
    }
    catch (error) {
      if (callback != undefined) {
        callback(error);
      }
    }
  };
}